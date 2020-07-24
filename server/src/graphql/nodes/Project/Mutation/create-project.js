const { Project, Organization } = require("../../../../models/index.js");
const storage = require("../../../../storage.js");
const { constants } = require("../../../../utils/index.js");
const redis = require("../../../../redis.js");

async function createProject(root, args, ctx) {
    const {
        input: {
            name,
            tagline,
            private: _private,
            markdown,
            due,
            organization,
            logo
        }
    } = args;

    const existingByName = await Project.findOne({ name });

    if (existingByName) {
        throw new Error(`Project with name: '${name}' already exists`);
    }

    if (organization) {
        const foundOrg = await Organization.findById(organization).lean();

        if (!foundOrg) {
            throw new Error("organization not found");
        }

        const allowed = [foundOrg.creator, ...foundOrg.admins].map((x) =>
            x.toString()
        );

        if (!allowed.includes(ctx.user)) {
            throw new Error("Forbidden");
        }
    }

    const project = await Project.create({
        name,
        tagline,
        private: _private,
        markdown,
        creator: ctx.user,
        due,
        organization
    });

    const bucket = `project-${project._id.toString()}`;

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
            Project.findByIdAndUpdate(project._id, {
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

    return project;
}

module.exports = createProject;
