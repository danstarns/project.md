/* eslint-disable default-case */
const { Organization, Document } = require("../../../../models/index.js");

async function document(root, arg, ctx) {
    const { id } = arg;

    let entity;
    const found = await Document.findById(id);

    if (!found) {
        throw new Error("Document not found");
    }

    switch (found.type) {
        case "organization":
            entity = await Organization.findById(found.subject);
            break;
    }

    if (!entity) {
        throw new Error(`${found.type} not found`);
    }

    if (entity.private) {
        switch (found.type) {
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
    }

    return found;
}

module.exports = document;
