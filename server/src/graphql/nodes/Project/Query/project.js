const { Project, Organization } = require("../../../../models/index.js");

async function project(root, { id }, ctx) {
    const foundProject = await Project.findById(id);

    if (!foundProject) {
        return null;
    }

    if (foundProject.private && ctx.user !== foundProject.creator.toString()) {
        throw new Error("Forbidden");
    }

    if (foundProject.organization) {
        const organization = await Organization.findById(
            foundProject.organization
        );

        const includedUsers = [
            organization.creator,
            ...organization.admins,
            ...organization.users
        ];

        if (!includedUsers.map((x) => x.toString()).includes(ctx.user)) {
            throw new Error("Forbidden");
        }
    }

    return foundProject;
}

module.exports = project;
