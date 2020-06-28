function users(root, args, ctx) {
    return ctx.injections.DataLoaders.UserLoader.load(root.users);
}

module.exports = users;
