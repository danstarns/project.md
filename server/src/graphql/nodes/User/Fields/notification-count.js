const { Notification } = require("../../../../models/index.js");

function notificationCount(root, args, ctx) {
    if (!ctx.user) {
        return null;
    }

    return Notification.countDocuments({
        invitee: ctx.user,
        seen: { $exists: false }
    });
}

module.exports = notificationCount;
