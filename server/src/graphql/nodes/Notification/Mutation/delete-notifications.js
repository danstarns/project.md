const { Notification } = require("../../../../models/index.js");

async function deleteNotifications(root, { ids }, ctx) {
    const found = await Notification.find({ _id: { $in: ids } });

    found.forEach((x) => {
        if (x.invitee.toString() !== ctx.user.toString()) {
            throw new Error("Forbidden");
        }
    });

    await Notification.deleteMany({ _id: { $in: found.map((x) => x._id) } });

    return true;
}

module.exports = deleteNotifications;
