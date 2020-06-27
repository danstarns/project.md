const { Project } = require("../../../../models/index.js");

async function projects(
    root,
    { input: { page, limit, search, sort, user } },
    ctx
) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const query = {
        organization: root._id,
        ...(search
            ? { $or: [{ name: regexMatch }, { tagline: regexMatch }] }
            : {})
    };

    if (user) {
        delete query.organization;

        query.$and = [{ organization: root._id }, { creator: ctx.user }];
    } else {
        query.private = false;
    }

    const { docs, hasNextPage } = await Project.paginate(query, {
        page,
        limit,
        sort: { createdAt: sort }
    });

    return {
        projects: docs,
        hasNextPage
    };
}

module.exports = projects;
