const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Project = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 60 },
        tagline: { type: String, required: true, maxlength: 60 },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        due: { type: Date, required: true },
        private: { type: Boolean, required: true },
        markdown: { type: String, required: true },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization"
        },
        logo: {
            etag: String,
            fileName: String,
            bucket: String
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    { timestamps: true }
);

Project.plugin(mongoosePaginate);

module.exports = mongoose.model("Project", Project);
