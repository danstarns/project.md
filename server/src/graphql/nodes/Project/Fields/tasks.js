const { Task } = require("../../../../models/index.js");

async function tasks(root, args, ctx) {
    const { input: { page, limit, search, sort, user } = {} } = args;

    const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

    const { hasNextPage, docs } = await Task.paginate(
        {
            project: root._id,
            ...(user ? { creator: ctx.user } : {}),
            ...(search
                ? { $or: [{ name: regexMatch }, { tagline: regexMatch }] }
                : {})
        },
        {
            page,
            limit,
            sort: { createdAt: sort }
        }
    );

    return {
        hasNextPage,
        data: {
            tasks: docs
        }
    };
}

module.exports = tasks;
