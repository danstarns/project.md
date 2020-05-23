const { Task } = require("../../../../models/index.js");

function task(root, { id }) {
    return Task.findById(id);
}

module.exports = task;
