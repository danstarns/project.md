const { Project } = require("../../../../models/index.js");

async function createProject(root, args, context) {
    try {
        const {
            input: {
                name,
                tagline,
                private: _private,
                markdown,
                due,
                organization
            }
        } = args;

        const existingByName = await Project.findOne({ name });

        if (existingByName) {
            throw new Error(`Project with name: '${name}' already exists`);
        }

        const project = await Project.create({
            name,
            tagline,
            private: _private,
            markdown,
            creator: context.user,
            due,
            organization
        });

        return {
            project
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = createProject;
