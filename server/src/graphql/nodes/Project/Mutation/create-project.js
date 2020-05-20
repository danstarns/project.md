const { Project } = require("../../../../models/index.js");

async function createProject(root, args, context) {
    try {
    	const { input: { name, tagline, private, markdown } } = args

    	const existingByName = await Project.findById({ name });

    	if (existingByName) {
    		throw new Error(`name: '${name}' already exists`);
    	}

    	const project = await Project.create(
    		{ 
    			name,
    			tagline,
    			private,
    			markdown,
    			creator: context.user
    		}
    	);

        return {
        	data: {
        		project
        	}
        };
    } catch (error) {
        return {
            data: null,
            error: {}
        };
    }
}

module.exports = createProject;
