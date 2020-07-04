const { Organization, Notification } = require("../../../../models/index.js");

async function inviteUserOrganizationCallback(root, args, ctx) {
    const { id, approve } = args.input;

    const notification = await Notification.findById(id);

    if (!notification) {
        throw new Error("Invalid code");
    }

    const { invitee, type, subject } = notification;

    if (invitee.toString() !== ctx.user.toString()) {
        throw new Error("Forbidden");
    }

    if (type !== "invitation") {
        throw new Error("Invalid code");
    }

    if (subject.type !== "organization") {
        throw new Error("Invalid code");
    }

    if (approve) {
        await Organization.findByIdAndUpdate(
            subject.id,
            {
                $addToSet: { users: invitee }
            },
            { new: true }
        );
    }

    await Notification.updateOne(
        { _id: notification._id },
        { $set: { seen: true, stale: true } }
    );

    return true;
}

module.exports = inviteUserOrganizationCallback;
