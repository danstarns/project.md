const mongoose = require("mongoose");

const Document = new mongoose.Schema(
    {
        name: { type: String, required: true },
        markdown: { type: String, required: true },
        rendered: {
            etag: String,
            fileName: String,
            bucket: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Document", Document);
