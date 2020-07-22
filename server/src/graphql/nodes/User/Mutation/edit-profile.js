const { User } = require("../../../../models/index.js");
const { hashPassword, constants } = require("../../../../utils/index.js");
const redis = require("../../../../redis.js");
const { CLIENT_URL } = require("../../../../config.js");
const storage = require("../../../../storage.js");

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
        const mimetype = file.mimetype;

        const bucket = `user-${ctx.user.toString()}`;
        const fileName = `profile-pic${
            mimetype.includes("png") ? ".png" : ".jpeg"
        }`;

        const etag = await storage.client.putObject(
            bucket,
            fileName,
            file.createReadStream()
        );

        const url = await storage.client.presignedUrl(
            "GET",
            bucket,
            fileName,
            constants.IMAGE_URL_EXPIRE_SECONDS
        );

        await redis.dbs.imageUrls.set(
            etag,
            JSON.stringify({ etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );

        updates.profilePic = { etag, fileName, bucket };
    }

    const updated = await User.findByIdAndUpdate(
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

    redis.pubsub.emit(`update:user:${ctx.user.toString()}`, {
        _id: ctx.user.toString()
    });

    return updated;
}

module.exports = editProfile;
