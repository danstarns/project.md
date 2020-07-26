/* eslint-disable default-case */
const { Organization, Document } = require("../../../../models/index.js");
const storage = require("../../../../storage.js");
const redis = require("../../../../redis.js");

async function createDocument(root, { input }, ctx) {
    const { name, markdown, type, subject } = input;

    let entity;

    switch (type) {
        case "organization":
            entity = await Organization.findById(subject);
            break;
    }

    if (!entity) {
        throw new Error(`${type} not found`);
    }

    switch (type) {
        case "organization":
            {
                if (
                    ![entity.creator, ...entity.admins]
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    throw new Error("Forbidden");
                }

                const orgDocs = (
                    await Document.find({ subject }).select("name")
                ).map((x) => x.name);

                if (orgDocs.includes(name)) {
                    throw new Error(
                        `Document with name '${name}' already taken`
                    );
                }
            }
            break;
    }

    const document = await Document.create({
        name,
        markdown,
        creator: ctx.user,
        type,
        subject: entity._id.toString()
    });

    const bucket = `document-${document._id.toString()}`;

    await storage.client.makeBucket(bucket);

    await redis.queues.renderer.add({ document: document._id.toString() });

    return document;
}

module.exports = createDocument;
