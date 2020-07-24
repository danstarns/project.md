const { Project, Organization } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");
const { constants } = require("../../../../utils/index.js");
const storage = require("../../../../storage.js");

async function editProject(root, args, ctx) {
    const { input: { id, ...updates } = {} } = args;

    const project = await Project.findById(id);

    if (!project) {
        throw new Error("project not found");
    }

    if (project.creator.toString() !== ctx.user) {
        if (project.organization) {
            const organization = await Organization.findById(
                project.organization
            );

            const allowed = [
                organization.creator,
                ...organization.admins
            ].map((x) => x.toString());

            if (!allowed.includes(ctx.user)) {
                throw new Error("Forbidden");
            }
        } else {
            throw new Error("Forbidden");
        }
    }

    if (updates.logo) {
        const file = await updates.logo;
        const mimetype = file.mimetype;

        const bucket = `project-${project._id.toString()}`;
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

    return Project.findByIdAndUpdate(id, updates, {
        new: true
    });
}

module.exports = editProject;
