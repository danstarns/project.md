/* eslint-disable default-case */
const {
    User,
    Organization,
    Project,
    Task,
    Message
} = require("../../../../models/index.js");
const redis = require("../../../../redis.js");

async function sendMessage(root, { input }, ctx) {
    const { type, subject, content } = input;

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

    const message = await Message.create({
        creator: ctx.user,
        type,
        subject,
        content
    });

    redis.pubsub.emit(
        `chat:${type}:${entity._id.toString()}`,
        message._id.toString()
    );

    return true;
}

module.exports = sendMessage;
