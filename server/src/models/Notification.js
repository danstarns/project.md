const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Notification = new mongoose.Schema(
    {
        creator: { type: mongoose.Schema.Types.ObjectId, required: true },
        invitee: { type: mongoose.Schema.Types.ObjectId, required: true },
        type: { type: String, enum: ["invitation"], required: true },
        subject: {
            id: { type: mongoose.Schema.Types.ObjectId, required: true },
            type: { type: String, enum: ["organization"], required: true },
            name: { type: String, required: true }
        },
        seen: Boolean,
        stale: Boolean
    },
    { timestamps: true }
);

Notification.plugin(mongoosePaginate);

module.exports = mongoose.model("Notification", Notification);
