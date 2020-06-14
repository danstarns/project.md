const mongoose = require("mongoose");

const Recent = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Task", "Project", "Organization"],
            required: true
        },
        entity: { type: String, required: true },
        user: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Recent", Recent);
