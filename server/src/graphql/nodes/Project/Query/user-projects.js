const { Project } = require("../../../../models/index.js");

async function userProjects(root, { input: { page, limit } }, ctx) {
    const { docs, hasNextPage } = await Project.paginate(
        { creator: ctx.user },
        { page, limit }
    );

    return {
        hasNextPage,
        data: {
            projects: docs
        }
    };
}

module.exports = userProjects;
