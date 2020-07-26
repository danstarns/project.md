const redis = require("../../../../redis.js");

const documentRender = {
    subscribe: async function* subscribe(root, args, ctx) {
        await new Promise((resolve) => {
            const channel = `document:render:${args.id}`;

            const sub = redis.pubsub.on(channel);

            function listener() {
                resolve();
                sub.removeListener(channel, listener);
            }

            ctx.subscriptions.push(() => sub.removeListener(channel, listener));
        });

        yield true;
    }
};

module.exports = documentRender;
