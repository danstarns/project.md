const { Project } = require("../../../../models/index.js");

function projectCount(root) {
    return Project.countDocuments({ organization: root._id });
}

module.exports = projectCount;
