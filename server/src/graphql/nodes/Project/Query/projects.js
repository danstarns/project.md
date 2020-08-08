const { Project, Organization } = require("../../../../models/index.js");

async function projects(root, { input: { page, limit, sort, search } }, ctx) {
    const query = {
        private: false
    };

    if (search) {
        const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };
        query.$or = [{ name: regexMatch }, { tagline: regexMatch }];
    }

    if (ctx.user) {
        const adminOfOrgs = await Organization.find({
            $or: [
                { users: ctx.user },
                { admins: ctx.user },
                { creator: ctx.user }
            ]
        }).select("_id");

        delete query.private;

        query.$and = [
            {
                $or: [
                    { creator: ctx.user },
                    { users: ctx.user },
                    { organization: { $in: adminOfOrgs.map((x) => x._id) } }
                ]
            }
        ];
    }

    const { docs, hasNextPage } = await Project.paginate(query, {
        page,
        limit,
        sort: { createdAt: sort }
    });

    return {
        hasNextPage,
        projects: docs
    };
}

module.exports = projects;
