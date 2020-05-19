const mongoose = require("mongoose");

const Project = new mongoose.Schema(
    {
        name: { type: String, required: true },
        tagline: { type: String, required: false },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        private: { type: Boolean, required: true },
        markdown: { type: String, required: false }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Project", Project);
