const { Project } = require("../../../../models/index.js");

async function userProjects(
    root,
    { input: { page, limit, sort, search } },
    ctx
) {
    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { docs, hasNextPage } = await Project.paginate(
        {
            creator: ctx.user,
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

module.exports = userProjects;
