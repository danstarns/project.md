async function organizations(root, args, ctx) {
    const visibleOrganizations = (
        await ctx.injections.DataLoaders.OrganizationLoader.load(root._id)
    ).filter((org) => {
        let access = true;

        if (org.private) {
            if (!ctx.user) {
                access = false;
            } else if (!ctx.user.toString() === org.creator.toString()) {
                access = false;
            }

            if (
                ctx.user &&
                ![...org.users, ...org.admins, org.creator]
                    .map((x) => x.toString())
                    .includes(ctx.user.toString())
            ) {
                access = false;
            }
        }

        return access;
    });

    return visibleOrganizations;
}

module.exports = organizations;
