const { Project } = require("../../../../models/index.js");

async function createProject(root, args, context) {
    try {
        const {
            input: { name, tagline, private: _private, markdown }
        } = args;

        const existingByName = await Project.findOne({ name });

        if (existingByName) {
            throw new Error(`name: '${name}' already exists`);
        }

        const project = await Project.create({
            name,
            tagline,
            private: _private,
            markdown,
            creator: context.user
        });

        return {
            data: {
                project
            }
        };
    } catch (error) {
        console.error(error);
        return {
            data: null,
            error: {
                message: error.message
            }
        };
    }
}

module.exports = createProject;
