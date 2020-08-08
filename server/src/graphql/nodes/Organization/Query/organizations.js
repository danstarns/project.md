const { Organization } = require("../../../../models/index.js");

async function organizations(
    root,
    { input: { page, limit, sort, search } },
    ctx
) {
    const query = {
        private: false
    };

    if (search) {
        const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };
        query.$or = [{ name: regexMatch }, { tagline: regexMatch }];
    }

    if (ctx.user) {
        delete query.private;

        query.$and = [
            {
                $or: [
                    { creator: ctx.user },
                    { admins: ctx.user },
                    { users: ctx.user }
                ]
            }
        ];
    }

    const { docs, hasNextPage } = await Organization.paginate(query, {
        page,
        limit,
        sort: { createdAt: sort }
    });

    return {
        hasNextPage,
        organizations: docs
    };
}

module.exports = organizations;
