const { Project } = require("../../../../models/index.js");

async function projects(root, { input: { page, limit, search, sort } }) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Project.paginate(
        {
            organization: root._id,
            ...(search
                ? { $or: [{ name: regexMatch }, { tagline: regexMatch }] }
                : {})
        },
        {
            page,
            limit,
            sort: { createdAt: sort }
        }
    );

    return {
        projects: docs,
        hasNextPage
    };
}

module.exports = projects;
