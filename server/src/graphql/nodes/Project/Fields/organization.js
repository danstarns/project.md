function organization(root, args, ctx) {
    if (!root.organization) {
        return null;
    }

    return ctx.injections.DataLoaders.OrganizationLoader.load(
        root.organization
    );
}

module.exports = organization;
