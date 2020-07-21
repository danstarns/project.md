const redis = require("../redis.js");

async function onDisconnect(ws, ctx) {
    const { user, subscriptions = [] } = await ctx.initPromise;

    subscriptions.forEach((sub) => sub());

    await redis.dbs.onlineUsers.del(user);
}

module.exports = onDisconnect;
