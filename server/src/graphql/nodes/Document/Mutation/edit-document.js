/* eslint-disable default-case */
const { Organization, Document } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");

async function editDocument(root, { input }, ctx) {
    const { id, name, markdown } = input;

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
            {
                if (
                    ![entity.creator, ...entity.admins]
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    throw new Error("Forbidden");
                }

                const orgDocs = (
                    await Document.find({
                        subject: document.subject,
                        name
                    }).select("_id name")
                )
                    .filter((x) => x._id.toString() !== id)
                    .map((x) => x.name);

                if (orgDocs.includes(name)) {
                    throw new Error(
                        `Document with name '${name}' already taken`
                    );
                }
            }
            break;
    }

    const updated = await Document.findByIdAndUpdate(
        id,
        {
            $set: {
                name,
                markdown,
                rendered: null
            }
        },
        { new: true }
    );

    await redis.queues.renderer.add({ document: document._id.toString() });

    return updated;
}

module.exports = editDocument;
