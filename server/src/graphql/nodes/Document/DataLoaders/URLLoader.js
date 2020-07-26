const DataLoader = require("dataloader");
const redis = require("../../../../redis.js");

const URLLoader = new DataLoader(async (etags) => {
    const urls = await redis.dbs.imageUrls.mget(etags);
    const parsedUrls = urls.map((x) => JSON.parse(x));

    return etags.map((etag) => {
        const found = parsedUrls.find((x) => x && x.etag === etag);

        if (!found) {
            return false;
        }

        return found.url;
    });
});

module.exports = URLLoader;
