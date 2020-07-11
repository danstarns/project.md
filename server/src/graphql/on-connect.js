const { decodeJWT } = require("../utils/index.js");
const redis = require("../redis.js");

async function onConnect(connectionParams) {
    const { authorization } = connectionParams;

    if (!connectionParams.authorization) {
        return { user: null };
    }

    const [, jwt] = authorization.split("Bearer ");

    const { sub } = await decodeJWT(jwt);

    if (sub) {
        await redis.dbs.onlineUsers.set(sub, 1);
    }

    return {
        user: sub
    };
}

module.exports = onConnect;
