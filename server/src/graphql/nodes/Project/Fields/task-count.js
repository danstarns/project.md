const { Task } = require("../../../../models/index.js");

function taskCount(root) {
    return Task.countDocuments({ project: root._id });
}

module.exports = taskCount;
