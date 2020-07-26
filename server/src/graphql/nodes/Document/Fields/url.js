const storage = require("../../../../storage.js");
const redis = require("../../../../redis.js");
const { constants } = require("../../../../utils/index.js");

async function url(root, args, ctx) {
    if (!root.rendered || !root.rendered.etag) {
        return null;
    }

    const found = await ctx.injections.DataLoaders.URLLoader.load(
        root.rendered.etag
    );

    if (!found) {
        const newUrl = await storage.client.presignedUrl(
            "GET",
            root.rendered.bucket,
            root.rendered.fileName,
            constants.IMAGE_URL_EXPIRE_SECONDS
        );

        await redis.dbs.imageUrls.set(
            root.rendered.etag,
            JSON.stringify({ etag: root.rendered.etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );

        return newUrl;
    }

    return found;
}

module.exports = url;
