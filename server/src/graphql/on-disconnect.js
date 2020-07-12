const redis = require("../redis.js");

async function onDisconnect(ws, ctx) {
    const context = await ctx.initPromise;

    await Promise.all([
        redis.dbs.onlineUsers.del(context.user),
        ...context.subscriptions.map((x) => x.unsubscribe())
    ]);
}

module.exports = onDisconnect;
