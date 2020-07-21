/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable default-case */
const util = require("util");
const redis = require("../../../../redis.js");

const sleep = util.promisify(setTimeout);

async function* messageGenerator({ ctx }) {
    let notifications = [];

    function listener(_, notification) {
        notifications.push(notification);
    }

    const channel = `create:notification:${ctx.user.toString()}`;
    const sub = redis.pubsub.on(channel, listener);

    ctx.subscriptions.push(() => sub.removeListener(channel, listener));

    while (true) {
        const [notification, ...rest] = notifications;

        if (!notification) {
            await sleep();

            continue;
        }

        notifications = rest;

        yield { notification };

        await sleep();
    }
}

const message = {
    subscribe: function subscribe(payload, variables, ctx) {
        return messageGenerator({ ctx });
    }
};

module.exports = message;
