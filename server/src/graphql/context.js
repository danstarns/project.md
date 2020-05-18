const { decodeJWT } = require("../utils/index.js");

async function context({ req, res }) {
    const authorization = req.header("authorization");

    if (!authorization) {
        return { user: null, req, res };
    }

    const [, jwt] = authorization.split("Bearer ");

    const { sub } = await decodeJWT(jwt);

    return {
        req,
        res,
        user: sub
    };
}

module.exports = context;
