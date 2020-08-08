const { Project, Organization } = require("../../../../models/index.js");

async function projects(root, { input: { page, limit, sort, search } }, ctx) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const query = {
        private: false,
        $and: [
            ...(search
                ? [{ $or: [{ name: regexMatch }, { tagline: regexMatch }] }]
                : [])
        ]
    };

    if (ctx.user) {
        const adminOfOrgs = await Organization.find({
            $or: [
                { users: ctx.user },
                { admins: ctx.user },
                { creator: ctx.user }
            ]
        }).select("_id");

        delete query.private;

        query.$and.push({
            $or: [
                { creator: ctx.user },
                { users: ctx.user },
                { organization: { $in: adminOfOrgs.map((x) => x._id) } }
            ]
        });
    }

    const { docs, hasNextPage } = await Project.paginate(query, {
        page,
        limit,
        sort: { createdAt: sort }
    });

    return {
        hasNextPage,
        data: {
            projects: docs
        }
    };
}

module.exports = projects;
