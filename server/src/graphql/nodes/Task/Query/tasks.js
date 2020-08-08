const { Task, Project, Organization } = require("../../../../models/index.js");

async function tasks(root, args, ctx) {
    const { page, limit, search } = args.input;

    const query = {};

    if (search) {
        const regexMatch = { $regex: new RegExp(search), $options: ["i", "g"] };

        query.name = regexMatch;
    }

    const publicProjects = await Project.find({ private: false }).select("_id");

    if (ctx.user) {
        let userProjects = await Project.find({
            $or: [{ users: ctx.user }, { creator: ctx.user }]
        }).select("_id");

        const adminOfOrgs = await Organization.find({
            $or: [
                { users: ctx.user },
                { admins: ctx.user },
                { creator: ctx.user }
            ]
        }).select("_id");

        const orgProjects = await Project.find({
            organization: { $in: adminOfOrgs.map((x) => x._id) }
        }).select("_id");

        userProjects = [...userProjects, ...orgProjects, ...publicProjects].map(
            (x) => x._id
        );

        query.$or = [
            {
                users: ctx.user
            },
            { project: { $in: userProjects } },
            { creator: ctx.user }
        ];
    } else {
        query.project = { $in: publicProjects.map((x) => x._id) };
    }

    const { docs, hasNextPage } = await Task.paginate(query, {
        page,
        limit
    });

    return {
        hasNextPage,
        tasks: docs
    };
}

module.exports = tasks;
