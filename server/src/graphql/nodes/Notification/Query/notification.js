const { Notification } = require("../../../../models/index.js");

function notification(root, { id }) {
    return Notification.findById(id);
}

module.exports = notification;
