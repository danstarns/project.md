const { Project } = require("../../../../models/index.js");

async function publicProjects(root, { input: { page, limit, sort, search } }) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Project.paginate(
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
        data: {
            projects: docs
        }
    };
}

module.exports = publicProjects;
