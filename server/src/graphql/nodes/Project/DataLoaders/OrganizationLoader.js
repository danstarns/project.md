const DataLoader = require("dataloader");
const { Organization } = require("../../../../models/index.js");

const OrganizationLoader = new DataLoader(async (ids) => {
    const organizations = await Organization.find({ _id: { $in: ids } });

    return ids.map((id) =>
        organizations.find((org) => org._id.toString() === id.toString())
    );
});

module.exports = OrganizationLoader;
