const redis = require("../redis.js");

async function onDisconnect(ws, ctx) {
    const { user } = await ctx.initPromise;
    await redis.dbs.onlineUsers.del(user);
}

module.exports = onDisconnect;
