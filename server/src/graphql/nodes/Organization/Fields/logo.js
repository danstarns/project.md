const storage = require("../../../../storage.js");
const redis = require("../../../../redis.js");
const { constants } = require("../../../../utils/index.js");

async function logo(root, args, ctx) {
    if (!root.logo.etag) {
        return null;
    }

    const url = await ctx.injections.DataLoaders.LogoLoader.load(
        root.logo.etag
    );

    if (!url) {
        const newUrl = await storage.client.presignedUrl(
            "GET",
            root.logo.bucket,
            root.logo.fileName,
            constants.IMAGE_URL_EXPIRE_SECONDS
        );

        await redis.dbs.imageUrls.set(
            root.logo.etag,
            JSON.stringify({ etag: root.logo.etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );

        return newUrl;
    }

    return url;
}

module.exports = logo;
