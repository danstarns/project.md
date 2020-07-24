async function isUserAdmin(root, args, ctx) {
    if (!ctx.user) {
        return false;
    }

    let allowed = [root.creator];

    if (root.organization) {
        const organization = await ctx.injections.DataLoaders.OrganizationLoader.load(
            root.organization
        );

        allowed = [...allowed, organization.creator, ...organization.admins];
    }

    return allowed.map((x) => x.toString()).includes(ctx.user.toString());
}

module.exports = isUserAdmin;
