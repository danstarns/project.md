/* eslint-disable default-case */
const { Organization, Document } = require("../../../../models/index.js");
const storage = require("../../../../storage.js");

async function deleteDocument(root, args, ctx) {
    const { id } = args;

    let entity;
    const document = await Document.findById(id);

    if (!document) {
        throw new Error("Document not found");
    }

    switch (document.type) {
        case "organization":
            entity = await Organization.findById(document.subject);
            break;
    }

    if (!entity) {
        throw new Error(`${document.type} not found`);
    }

    switch (document.type) {
        case "organization":
            if (
                ![entity.creator, ...entity.admins]
                    .map((x) => x.toString())
                    .includes(ctx.user.toString())
            ) {
                throw new Error("Forbidden");
            }
            break;
    }

    const bucket = `document-${document._id.toString()}`;

    const objects = [];

    for await (const x of storage.client.listObjects(bucket)) {
        objects.push(x);
    }

    await storage.client.removeObjects(bucket, objects);

    await Document.findByIdAndDelete(id);

    return true;
}

module.exports = deleteDocument;
