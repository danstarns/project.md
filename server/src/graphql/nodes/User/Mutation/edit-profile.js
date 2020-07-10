/* eslint-disable no-restricted-syntax */
const { User } = require("../../../../models/index.js");
const { hashPassword } = require("../../../../utils/index.js");
const redis = require("../../../../redis.js");
const { CLIENT_URL } = require("../../../../config.js");

async function editProfile(
    root,
    { input: { username, email, password, profilePic } },
    ctx
) {
    const updates = {};

    if (username) {
        const existingByUName = await User.findOne({ username });

        if (
            existingByUName &&
            existingByUName._id.toString() !== ctx.user.toString()
        ) {
            throw new Error(`username: '${username}' already registered`);
        }

        updates.username = username;
    }

    if (email) {
        const existingByEmail = await User.findOne({ email });

        if (
            existingByEmail &&
            existingByEmail._id.toString() !== ctx.user.toString()
        ) {
            throw new Error(`email: '${email}' already registered`);
        }

        updates.email = email;
    }

    if (password) {
        const hash = await hashPassword(password);
        updates.password = hash;
    }

    if (profilePic) {
        const file = await profilePic;
        const buffers = [];

        updates.profilePic = {
            mimetype: file.mimetype,
            data: null
        };

        for await (const chunk of file.createReadStream()) {
            buffers.push(chunk);
        }

        updates.profilePic.data = Buffer.concat(buffers);
    }

    const updated = await User.findOneAndUpdate(
        ctx.user,
        { $set: updates },
        { new: true }
    );

    if (password) {
        await redis.queues.email.add({
            to: updated.email,
            subject: "Password Change",
            html: `
                <p>
                    You recently changed your password, if it was not you go <a href="${CLIENT_URL}/forgot-password">Here</a> to change it back,
                    otherwise ignore this email.
                </p>
            `
        });
    }

    return updated;
}

module.exports = editProfile;
