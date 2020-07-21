const { decodeJWT } = require("../utils/index.js");
const redis = require("../redis.js");

async function context({ req, res, connection }) {
    const authorization = req.header("authorization");

    if (!authorization) {
        return { user: null, req, res };
    }

    const [, jwt] = authorization.split("Bearer ");

    const { sub } = await decodeJWT(jwt);

    if (sub) {
        await redis.dbs.onlineUsers.set(
            sub,
            new Date().toISOString(),
            "EX",
            600
        );
    }

    if (connection) {
        return {
            user: sub,
            ...connection.context
        };
    }

    return {
        req,
        res,
        user: sub
    };
}

module.exports = context;
