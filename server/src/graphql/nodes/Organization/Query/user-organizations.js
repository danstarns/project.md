const { Organization } = require("../../../../models/index.js");

async function userOrganizations(
    root,
    { input: { page, limit, sort, search } },
    ctx
) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Organization.paginate(
        {
            $and: [
                {
                    $or: [
                        { creator: ctx.user },
                        { admins: ctx.user },
                        { users: ctx.user }
                    ]
                },
                ...(search
                    ? [{ $or: [{ name: regexMatch }, { tagline: regexMatch }] }]
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
