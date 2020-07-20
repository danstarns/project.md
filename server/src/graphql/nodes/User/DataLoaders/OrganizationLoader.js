const DataLoader = require("dataloader");
const { Organization } = require("../../../../models/index.js");

const OrganizationLoader = new DataLoader(async (ids) => {
    const organizations = await Organization.find({
        $or: [
            { creator: { $in: ids } },
            { admins: { $all: ids } },
            { users: { $all: ids } }
        ]
    });

    return ids.map((id) =>
        organizations.filter((org) =>
            [org.creator, ...org.admins, ...org.users]
                .map((x) => x.toString())
                .includes(id.toString())
        )
    );
});

module.exports = OrganizationLoader;
