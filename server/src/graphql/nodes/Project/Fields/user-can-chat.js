async function userCanChat(root, args, ctx) {
    if (!ctx.user) {
        return false;
    }

    let allowed = [root.creator, ...root.users];

    if (root.organization) {
        const organization = await ctx.injections.DataLoaders.OrganizationLoader.load(
            root.organization
        );

        allowed = [...allowed, organization.creator, ...organization.admins];
    }

    return allowed.map((x) => x.toString()).includes(ctx.user.toString());
}

module.exports = userCanChat;
