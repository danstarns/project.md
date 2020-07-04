const { Notification } = require("../../../../models/index.js");

async function viewNotifications(root, { ids }, ctx) {
    const found = await Notification.find({ _id: { $in: ids } });

    found.forEach((x) => {
        if (x.invitee.toString() !== ctx.user.toString()) {
            throw new Error("Forbidden");
        }
    });

    await Notification.updateMany(
        { _id: { $in: found.map((x) => x._id) } },
        { $set: { seen: true } }
    );

    return true;
}

module.exports = viewNotifications;
