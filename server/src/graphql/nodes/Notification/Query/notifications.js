const { Notification } = require("../../../../models/index.js");

async function notifications(root, { input: { page, limit } }, ctx) {
    const { docs, hasNextPage } = await Notification.paginate(
        {
            invitee: ctx.user
        },
        { page, limit, sort: { createdAt: "desc" } }
    );

    return {
        hasNextPage,
        notifications: docs
    };
}

module.exports = notifications;
