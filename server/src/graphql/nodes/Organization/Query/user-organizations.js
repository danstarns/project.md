const { Organization } = require("../../../../models/index.js");

async function userOrganizations(
    root,
    { input: { page, limit, sort, search } },
    ctx
) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Organization.paginate(
        {
            $or: [
                { creator: ctx.user },
                { admins: ctx.user },
                { users: ctx.user },
                ...(search
                    ? [{ name: regexMatch }, { tagline: regexMatch }]
                    : [])
            ]
        },
        { page, limit, sort: { createdAt: sort } }
    );

    return {
        hasNextPage,
        organizations: docs
    };
}

module.exports = userOrganizations;
