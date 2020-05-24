const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Task = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 60 },
        tagline: { type: String, required: true, maxlength: 60 },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        due: { type: Date, required: true },
        markdown: { type: String, required: true },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Project"
        }
    },
    { timestamps: true }
);

Task.plugin(mongoosePaginate);

module.exports = mongoose.model("Task", Task);
