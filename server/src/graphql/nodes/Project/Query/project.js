const { Project } = require("../../../../models/index.js");

async function project(root, { input: { username, email, password } }) {
    try {
        return {};
    } catch (error) {
        return {
            data: null,
            error: {}
        };
    }
}

module.exports = project;
