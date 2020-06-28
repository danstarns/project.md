async function creator(root, args, ctx) {
    const users = await ctx.injections.DataLoaders.UserLoader.load([
        root.creator
    ]);

    return users[0];
}

module.exports = creator;
