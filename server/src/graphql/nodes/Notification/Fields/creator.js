async function creator(root, args, ctx) {
    const [user] = await ctx.injections.DataLoaders.UserLoader.load([
        root.creator
    ]);

    return user;
}

module.exports = creator;
