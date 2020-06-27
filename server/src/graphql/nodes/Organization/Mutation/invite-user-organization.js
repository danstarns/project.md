const { v4: uuid } = require("uuid");
const { User, Organization } = require("../../../../models/index.js");
const redis = require("../../../../redis.js");
const { API_URL } = require("../../../../config.js");

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

    const token = uuid();

    await redis.dbs.invite.set(
        token,
        JSON.stringify({
            organization: id,
            host: ctx.user._id.toString(),
            invitee: user._id.toString()
        })
    );

    await redis.queues.email.add({
        to: user.email,
        subject: `Project.md Project (${org.name}) Invite`,
        html: `
            <p>
                ${ctx.user.username} Invited you to Organization '${org.name}'
                Click <a href="${API_URL}/api/invite/organization?code=${token}">Here</a> to join,
                otherwise ignore this email.
            </p>
        `
    });

    return true;
}

module.exports = inviteUserOrganization;
