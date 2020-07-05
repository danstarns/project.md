const { Organization, Notification } = require("../../../../models/index.js");

async function organization(root, args, ctx) {
    const org = await Organization.findById(args.id);

    if (!org) {
        return null;
    }

    if (org.private) {
        if (args.key) {
            const notification = await Notification.findById(args.key);

            if (!notification) {
                throw new Error("Forbidden");
            }
        } else if (!ctx.user) {
            throw new Error("Forbidden");
        } else if (
            ![...org.users, ...org.admins, org.creator]
                .map((x) => x.toString())
                .includes(ctx.user)
        ) {
            throw new Error("Forbidden");
        }
    }

    return org;
}

module.exports = organization;
