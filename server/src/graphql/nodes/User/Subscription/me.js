/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable default-case */
const util = require("util");
const redis = require("../../../../redis.js");
const { User } = require("../../../../models/index.js");

const sleep = util.promisify(setTimeout);

async function* messageGenerator({ ctx }) {
    let updates = [];

    function listener(_, event) {
        updates.push(event);
    }

    const channel = `update:user:${ctx.user.toString()}`;
    const sub = redis.pubsub.on(channel, listener);

    ctx.subscriptions.push(() => sub.removeListener(channel, listener));

    while (true) {
        const [event, ...rest] = updates;

        if (!event) {
            await sleep();

            continue;
        }

        updates = rest;

        yield { me: await User.findById(ctx.user.toString()) };

        await sleep();
    }
}

const message = {
    subscribe: function subscribe(payload, variables, ctx) {
        return messageGenerator({ ctx });
    }
};

module.exports = message;
