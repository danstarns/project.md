/* eslint-disable default-case */
const { Document, Organization } = require("../../../../models/index.js");

async function documents(root, args, ctx) {
    const { subject, type } = args.input;

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
            if (entity.private) {
                if (!ctx.user) {
                    throw new Error("Forbidden");
                }

                const users = [
                    entity.creator,
                    ...entity.admins,
                    ...entity.users
                ];

                if (
                    !users
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    throw new Error("Forbidden");
                }
            }
            break;
    }

    const query = { type, subject };

    return Document.find(query);
}

module.exports = documents;
