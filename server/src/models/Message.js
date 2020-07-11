const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Message = new mongoose.Schema(
    {
        content: { type: String, required: true },
        creator: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: {
            type: String,
            enum: ["user", "task", "organization", "project"],
            required: true
        },
        subject: { type: mongoose.Schema.Types.ObjectId, required: true },
        seen: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

Message.plugin(mongoosePaginate);

module.exports = mongoose.model("Message", Message);
