const { Notification } = require("../../../../models/index.js");

function notification(root, { id }) {
    return Notification.findByIdAndUpdate(
        id,
        { $set: { seen: true } },
        { new: true }
    );
}

module.exports = notification;
