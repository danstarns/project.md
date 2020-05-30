const { Organization } = require("../../../../models/index.js");

async function editOrganization(root, args) {
    try {
        const {
            input: { id, ...updates }
        } = args;

        const organization = await Organization.findByIdAndUpdate(id, updates, {
            new: true
        });

        if (!organization) {
            throw new Error("Organization not found");
        }

        return {
            organization
        };
    } catch (error) {
        return {
            error: {
                message: error.message
            }
        };
    }
}

module.exports = editOrganization;
