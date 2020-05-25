const { Organization } = require("../../../../models/index.js");

function organization(root, args) {
    return Organization.findById(args.id);
}

module.exports = organization;
