const DataLoader = require("dataloader");
const { Project } = require("../../../../models/index.js");

const ProjectLoader = new DataLoader(async (ids) => {
    const projects = await Project.find({
        creator: { $in: ids }
    }).populate("organization");

    return ids.map((id) =>
        projects.filter(
            (project) => project.creator.toString() === id.toString()
        )
    );
});

module.exports = ProjectLoader;
