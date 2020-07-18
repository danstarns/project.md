function userCanChat(root, args, ctx) {
    if (!ctx.user) {
        return false;
    }

    const users = [root.creator, ...root.admins, ...root.users];

    if (!users.map((x) => x.toString()).includes(ctx.user.toString())) {
        return false;
    }

    return true;
}

module.exports = userCanChat;
