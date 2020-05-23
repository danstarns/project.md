const { Project } = require("../../../../models/index.js");

async function editProject(root, args) {
    try {
        const { input: { id, ...updates } = {} } = args;

        const project = await Project.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!project) {
            throw new Error(`Project not found`);
        }

        return {
            data: {
                project
            }
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = editProject;
