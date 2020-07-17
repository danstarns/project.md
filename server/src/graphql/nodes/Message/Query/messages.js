/* eslint-disable default-case */
const {
    User,
    Organization,
    Project,
    Task,
    Message
} = require("../../../../models/index.js");

async function messages(root, { input }, ctx) {
    const { type, subject, page, limit } = input;

    let entity;

    switch (type) {
        case "user":
            entity = await User.findById(subject);
            break;
        case "task":
            entity = await Task.findById(subject);
            break;
        case "project":
            entity = await Project.findById(subject);
            break;
        case "organization":
            entity = await Organization.findById(subject);
            break;
    }

    if (!entity) {
        throw new Error(`${type} not found`);
    }

    switch (type) {
        case "user":
            if (!ctx.user) {
                throw new Error("Forbidden");
            }

            break;
        case "task":
            if (entity.private) {
                if (!ctx.user) {
                    throw new Error("Forbidden");
                }

                const users = [entity.creator];

                if (
                    !users
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    throw new Error("Forbidden");
                }
            }
            break;
        case "project":
            if (entity.private) {
                if (!ctx.user) {
                    throw new Error("Forbidden");
                }

                const users = [entity.creator];

                if (
                    !users
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    throw new Error("Forbidden");
                }
            }
            break;
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

    const { docs, hasNextPage } = await Message.paginate(query, {
        page,
        limit,
        sort: { createdAt: "desc" }
    });

    return {
        hasNextPage,
        messages: docs.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
    };
}

module.exports = messages;
