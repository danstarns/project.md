/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable default-case */
const util = require("util");
const { Organization } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");

const sleep = util.promisify(setTimeout);

async function* messageGenerator({ topic, entity, ctx }) {
    let organizations = [];

    function listener(_, message) {
        organizations.push(message);
    }

    const channel = `update:${topic}:${entity}`;
    const sub = redis.pubsub.on(channel, listener);

    ctx.subscriptions.push(() => sub.removeListener(channel, listener));

    while (true) {
        const [organization, ...rest] = organizations;

        if (!organization) {
            await sleep();

            continue;
        }

        organizations = rest;

        yield { organization };

        await sleep();
    }
}

const organization = {
    subscribe: async function subscribe(payload, variables, ctx) {
        const { id } = variables;

        const org = await Organization.findById(id);

        if (org.private) {
            if (!ctx.user) {
                throw new Error("Forbidden");
            }

            const users = [org.creator, ...org.admins, ...org.users];

            if (!users.map((x) => x.toString()).includes(ctx.user.toString())) {
                throw new Error("Forbidden");
            }
        }

        return messageGenerator({
            topic: "organization",
            entity: id,
            ctx
        });
    }
};

module.exports = organization;
