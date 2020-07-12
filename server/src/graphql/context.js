const { decodeJWT } = require("../utils/index.js");

async function context({ req, res, connection }) {
    const authorization = req.header("authorization");

    if (!authorization) {
        return { user: null, req, res };
    }

    const [, jwt] = authorization.split("Bearer ");

    const { sub } = await decodeJWT(jwt);

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
