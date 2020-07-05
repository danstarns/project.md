const { User } = require("../../../../models/index.js");

function user(root, args) {
    return User.findById(args.id);
}

module.exports = user;
