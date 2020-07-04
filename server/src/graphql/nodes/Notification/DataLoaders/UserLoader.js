const DataLoader = require("dataloader");
const { User } = require("../../../../models/index.js");

const UserLoader = new DataLoader(async (idsMatrix) => {
    const users = await User.find({ _id: { $in: idsMatrix.flat() } });

    return idsMatrix.map((ids) => {
        return ids.map((id) =>
            users.find((user) => user._id.toString() === id.toString())
        );
    });
});

module.exports = UserLoader;
