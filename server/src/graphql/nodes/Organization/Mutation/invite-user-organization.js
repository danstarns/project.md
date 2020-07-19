const {
    User,
    Organization,
    Notification
} = require("../../../../models/index.js");
const { CLIENT_URL } = require("../../../../config.js");
const redis = require("../../../../redis.js");

async function inviteUserOrganization(root, args, ctx) {
    const {
        input: { id, email }
    } = args;

    const org = await Organization.findById(id);

    if (!org) {
        throw new Error("Organization not found");
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        return true;
    }

    if (
        [...org.users, ...org.admins, org.creator]
            .map((x) => x._id.toString())
            .includes(user._id.toString())
    ) {
        return true;
    }

    const notification = await Notification.create({
        creator: ctx.user,
        invitee: user._id,
        type: "invitation",
        subject: {
            id: org._id,
            type: "organization",
            name: org.name
        }
    });

    await redis.queues.email.add({
        to: user.email,
        subject: `Project.md Organization (${org.name}) Invite`,
        html: `
            <p>
                ${ctx.user.username} Invited you to Organization '${org.name}'
                Click <a href="${CLIENT_URL}/invite/${notification._id.toString()}">Here</a> to join,
                otherwise ignore this email.
            </p>
        `
    });

    return true;
}

module.exports = inviteUserOrganization;
