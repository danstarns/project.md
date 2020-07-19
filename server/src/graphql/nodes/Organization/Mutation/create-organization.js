const { Organization } = require("../../../../models/index.js");
const storage = require("../../../../storage.js");
const { constants } = require("../../../../utils/index.js");
const redis = require("../../../../redis.js");

async function createOrganization(root, args, context) {
    const {
        input: { name, tagline, private: _private, markdown, logo }
    } = args;

    const existingByName = await Organization.findOne({ name });

    if (existingByName) {
        throw new Error(`Organization with name: '${name}' already exists`);
    }

    const organization = await Organization.create({
        name,
        tagline,
        private: _private,
        markdown,
        creator: context.user
    });

    const bucket = `organization-${organization._id.toString()}`;

    await storage.client.makeBucket(bucket);

    if (logo) {
        const file = await logo;
        const mimetype = file.mimetype;

        const fileName = `logo${mimetype.includes("png") ? ".png" : ".jpeg"}`;

        const etag = await storage.client.putObject(
            bucket,
            fileName,
            file.createReadStream()
        );

        const [url] = await Promise.all([
            storage.client.presignedUrl(
                "GET",
                bucket,
                fileName,
                constants.IMAGE_URL_EXPIRE_SECONDS
            ),
            Organization.findByIdAndUpdate(organization._id, {
                $set: { logo: { etag, fileName, bucket } }
            })
        ]);

        await redis.dbs.imageUrls.set(
            etag,
            JSON.stringify({ etag, url }),
            "EX",
            constants.IMAGE_URL_EXPIRE_SECONDS - 100
        );
    }

    return organization;
}

module.exports = createOrganization;
