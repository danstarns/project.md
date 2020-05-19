const { Project } = require("../../../../models/index.js");

async function createProject(root, { input: { username, email, password } }) {
    try {
        return {};
    } catch (error) {
        return {
            data: null,
            error: {}
        };
    }
}

module.exports = createProject;
