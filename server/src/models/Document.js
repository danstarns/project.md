const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Document = new mongoose.Schema(
    {
        name: { type: String, required: true },
        markdown: { type: String, required: true },
        rendered: {
            etag: String,
            fileName: String,
            bucket: String
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        type: {
            type: String,
            enum: ["organization"],
            required: true
        },
        subject: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

Document.plugin(mongoosePaginate);

module.exports = mongoose.model("Document", Document);
