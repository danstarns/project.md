function isRequester(root, args, ctx) {
    if (!ctx.user) {
        return false;
    }

    return Boolean(root._id.toString() === ctx.user.toString());
}

module.exports = isRequester;
