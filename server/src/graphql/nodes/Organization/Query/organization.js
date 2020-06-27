const { Organization } = require("../../../../models/index.js");

async function organization(root, args, ctx) {
    const org = await Organization.findById(args.id);

    if (!org) {
        return null;
    }

    if (!org.public) {
        if (!ctx.user) {
            throw new Error("Forbidden");
        }

        if (
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
