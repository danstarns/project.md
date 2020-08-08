const { User } = require("../../../../models/index.js");

async function users(root, args) {
    const { page, limit, search } = args.input;

    const query = {};

    if (search) {
        const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

        query.username = regexMatch;
    }

    const { docs, hasNextPage } = await User.paginate(query, {
        page,
        limit
    });

    return {
        hasNextPage,
        users: docs
    };
}

module.exports = users;
