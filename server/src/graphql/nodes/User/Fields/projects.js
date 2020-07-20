async function projects(root, args, ctx) {
    const visibleProjects = (
        await ctx.injections.DataLoaders.ProjectLoader.load(root._id)
    ).filter((project) => {
        let access = true;

        if (project.private) {
            if (!ctx.user) {
                access = false;
            } else if (!ctx.user.toString() === project.creator.toString()) {
                access = false;
            }

            if (ctx.user && project.organization) {
                if (
                    ![
                        ...project.organization.users,
                        ...project.organization.admins,
                        project.organization.creator
                    ]
                        .map((x) => x.toString())
                        .includes(ctx.user.toString())
                ) {
                    access = false;
                }
            }
        }

        return access;
    });

    return visibleProjects;
}

module.exports = projects;
