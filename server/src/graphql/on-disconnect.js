const redis = require("../redis.js");

async function onDisconnect(ws, ctx) {
    const context = await ctx.initPromise;

    await Promise.all([redis.dbs.onlineUsers.del(context.user)]);
}

module.exports = onDisconnect;
