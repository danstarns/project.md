const { Project } = require("../../../../models/index.js");

function project(root, { id }) {
    return Project.findById(id);
}

module.exports = project;
