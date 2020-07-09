function isRequester(root, args, ctx) {
    if (!ctx.user) {
        return false;
    }

    return Boolean(
        root._id.toString() === ctx.user ||
            root._id.toString() === ctx.user._id.toString()
    );
}

module.exports = isRequester;
