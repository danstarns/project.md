const redis = require("../redis.js");

async function onDisconnect(ws, ctx) {
    const { user, subscriptions = [] } = await ctx.initPromise;

    await Promise.all([
        redis.dbs.onlineUsers.del(user),
        ...subscriptions.map((x) => x.unsubscribe())
    ]);
}

module.exports = onDisconnect;
