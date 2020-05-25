const { Organization } = require("../../../../models/index.js");

async function createOrganization(root, args, context) {
    try {
        const {
            input: { name, tagline, private: _private, markdown }
        } = args;

        const existingByName = await Organization.findOne({ name });

        if (existingByName) {
            throw new Error(`Organization with name: '${name}' already exists`);
        }

        const organization = await Organization.create({
            name,
            tagline,
            private: _private,
            markdown,
            creator: context.user
        });

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

module.exports = createOrganization;
