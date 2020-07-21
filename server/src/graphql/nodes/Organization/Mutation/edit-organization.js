const { Organization } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");
const { constants } = require("../../../../utils/index.js");
const storage = require("../../../../storage.js");

async function editOrganization(root, args, ctx) {
    const {
        input: { id, ...updates }
    } = args;

    const organization = await Organization.findById(id);

    if (!organization) {
        throw new Error("Organization not found");
    }

    if (
        ![
            organization.creator.toString(),
            ...organization.admins.map((x) => x.toString())
        ].includes(ctx.user.toString())
    ) {
        throw new Error("Forbidden");
    }

    if (updates.logo) {
        const file = await updates.logo;
        const mimetype = file.mimetype;

        const bucket = `organization-${organization._id.toString()}`;
        const fileName = `logo${mimetype.includes("png") ? ".png" : ".jpeg"}`;

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

        updates.logo = { etag, fileName, bucket };
    }

    const updated = await Organization.findByIdAndUpdate(id, updates, {
        new: true
    });

    redis.pubsub.emit(`update:organization:${id}`, updated);

    return updated;
}

module.exports = editOrganization;
