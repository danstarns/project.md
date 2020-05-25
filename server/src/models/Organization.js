const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Organization = new mongoose.Schema(
    {
        name: { type: String, required: true, maxlength: 60 },
        tagline: { type: String, required: true, maxlength: 60 },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        private: { type: Boolean, required: true },
        markdown: { type: String, required: true }
    },
    { timestamps: true }
);

Organization.plugin(mongoosePaginate);

module.exports = mongoose.model("Organization", Organization);
