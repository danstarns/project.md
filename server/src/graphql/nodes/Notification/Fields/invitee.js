async function invitee(root, args, ctx) {
    const [user] = await ctx.injections.DataLoaders.UserLoader.load([
        root.invitee
    ]);

    return user;
}

module.exports = invitee;
