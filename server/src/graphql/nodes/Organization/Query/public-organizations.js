const { Organization } = require("../../../../models/index.js");

async function publicOrganizations(
    root,
    { input: { page, limit, sort, search } }
) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Organization.paginate(
        {
            private: false,
            ...(search
                ? { $or: [{ name: regexMatch }, { tagline: regexMatch }] }
                : {})
        },
        { page, limit, sort: { createdAt: sort } }
    );

    return {
        hasNextPage,
        organizations: docs
    };
}

module.exports = publicOrganizations;
