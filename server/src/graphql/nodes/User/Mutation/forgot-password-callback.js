const { User } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");
const { hashPassword } = require("../../../../utils/index.js");

async function forgotPasswordCallback(root, args) {
    const {
        input: { token, password }
    } = args;

    const job = await redis.dbs.passwordReset.get(token);

    if (!job) {
        return true;
    }

    const user = await User.findById(job);

    if (!user) {
        return true;
    }

    const hashed = await hashPassword(password);

    await User.findByIdAndUpdate(job, { $set: { password: hashed } });

    await redis.dbs.passwordReset.del(token);

    return true;
}

module.exports = forgotPasswordCallback;
