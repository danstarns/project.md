const { Task } = require("../../../../models/index.js");

async function editTask(root, args) {
    try {
        const { input: { id, ...updates } = {} } = args;

        const existingByName = await Task.findOne({
            _id: { $ne: id },
            name: updates.name
        });

        if (existingByName) {
            throw new Error(`Task with name: '${updates.name}' already exists`);
        }

        const task = await Task.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!task) {
            throw new Error(`Task not found`);
        }

        return {
            data: {
                task
            }
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = editTask;
