const { Organization, User } = require("../../../../models/index.js");

async function revokeAdminOrganization(root, args, ctx) {
    const { id, user: userId } = args.context;

    const organization = await Organization.findById(id);

    if (!organization) {
        throw new Error("Organization not found");
    }

    if (organization.creator._id.toString() !== ctx.user.toString()) {
        throw new Error("Forbidden");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (organization.users.includes(user._id.toString())) {
        return true;
    }

    if (!organization.admins.includes(user._id.toString())) {
        throw new Error("User not part of organization");
    }

    const update = {
        $pull: { admins: user._id },
        $addToSet: { users: user._id }
    };

    await Organization.updateOne({ _id: id }, update);

    return true;
}

module.exports = revokeAdminOrganization;
