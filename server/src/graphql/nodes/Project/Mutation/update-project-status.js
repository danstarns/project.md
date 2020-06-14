const { Project } = require("../../../../models/index.js");

async function updateProjectStatus(root, args) {
    try {
        const { input: { id, status } = {} } = args;

        const project = await Project.findByIdAndUpdate(
            id,
            { status },
            {
                new: true
            }
        );

        if (!project) {
            throw new Error("Project not found");
        }

        return {
            status
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = updateProjectStatus;
