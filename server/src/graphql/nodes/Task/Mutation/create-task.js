const { Task, Project } = require("../../../../models/index.js");

async function createTask(root, args, ctx) {
    try {
        const {
            input: { name, tagline, due, markdown, project: projectID }
        } = args;

        const existingByName = await Task.findOne({ name });

        if (existingByName) {
            throw new Error(`Task with name: '${name}' already exists`);
        }

        const project = await Project.findById(projectID);

        if (!project) {
            throw new Error(`Project: '${projectID}' not found`);
        }

        const task = await Task.create({
            name,
            tagline,
            creator: ctx.user,
            due,
            markdown,
            project: project._id
        });

        return {
            data: { task }
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = createTask;
