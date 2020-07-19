const storage = require("../../../../storage.js");
const redis = require("../../../../redis.js");
const { constants } = require("../../../../utils/index.js");

async function profilePic(root, args, ctx) {
    if (!root.profilePic.etag) {
        return null;
    }

    const url = await ctx.injections.DataLoaders.ProfilePicLoader.load(
        root.profilePic.etag
    );

    if (!url) {
        const newUrl = await storage.client.presignedUrl(
            "GET",
            root.profilePic.bucket,
            root.profilePic.fileName,
            constants.IMAGE_URL_EXPIRE_SECONDS
        );

        await redis.dbs.imageUrls.set(
            root.profilePic.etag,
            JSON.stringify({ etag: root.profilePic.etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );

        return newUrl;
    }

    return url;
}

module.exports = profilePic;
