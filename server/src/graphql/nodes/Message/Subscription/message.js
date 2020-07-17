/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable default-case */
const util = require("util");
const {
    User,
    Organization,
    Project,
    Task,
    Message
} = require("../../../../models/index.js");
const redis = require("../../../../redis.js");

const sleep = util.promisify(setTimeout);

async function* messageGenerator(topic, ctx) {
    let messages = [];

    const sub = redis.pubsub.sub.on(`pmessage`, (pattern, channel, message) => {
        const [, id] = channel.split(":");

        if (id === topic) {
            messages.push(message);
        }
    });

    ctx.subscriptions.push(sub);

    while (true) {
        const [message, ...rest] = messages;

        if (!message) {
            await sleep();

            continue;
        }

        messages = rest;

        yield { message: await Message.findById(message) };

        await sleep();
    }
}

const message = {
    subscribe: async function subscribe(payload, variables, ctx) {
        const { type, subject } = variables.input;

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

        return messageGenerator(entity._id.toString(), ctx);
    }
};

module.exports = message;