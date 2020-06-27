function isUserAdmin(root, args, ctx) {
    const found = [...root.admins, root.creator]
        .map((x) => x.toString())
        .includes(ctx.user);

    return found;
}

module.exports = isUserAdmin;
