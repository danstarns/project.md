const { v4: uuid } = require("uuid");
const { User } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");
const { CLIENT_URL } = require("../../../../config.js");

async function forgotPasswordRequest(root, args) {
    const {
        input: { search }
    } = args;

    const user = await User.findOne({
        $or: [{ username: search }, { email: search }]
    });

    const token = uuid();

    if (!user) {
        return true;
    }

    await redis.dbs.passwordReset.set(token, user._id.toString());

    await redis.queues.email.add({
        to: user.email,
        subject: "Project.md Password Reset",
        html: `
            <p>
                Click <a href="${CLIENT_URL}/password-reset/${token}">Here</a> to reset password,
                otherwise ignore this email.
            </p>
        `
    });

    return true;
}

module.exports = forgotPasswordRequest;
