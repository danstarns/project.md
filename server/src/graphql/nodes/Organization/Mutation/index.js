const createOrganization = require("./create-organization.js");
const editOrganization = require("./edit-organization.js");
const inviteUserOrganization = require("./invite-user-organization.js");
const inviteUserOrganizationCallback = require("./invite-user-organization-callback.js");
const assignAdminOrganization = require("./assign-admin-organization.js");
const revokeAdminOrganization = require("./revoke-admin-organization.js");

module.exports = {
    createOrganization,
    editOrganization,
    inviteUserOrganization,
    inviteUserOrganizationCallback,
    assignAdminOrganization,
    revokeAdminOrganization
};
