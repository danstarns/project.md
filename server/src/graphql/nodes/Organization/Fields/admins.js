function admins(root, args, ctx) {
    return ctx.injections.DataLoaders.UserLoader.load(root.admins);
}

module.exports = admins;
