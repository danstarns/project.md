const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const layouts = require("handlebars-layouts");

const layout = fs.readFileSync(path.join(__dirname, "./layout.hbs"), "utf8");
handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial("layout", layout);

const error = fs.readFileSync(path.join(__dirname, "./error.hbs"), "utf8");
const inviteOrganization = fs.readFileSync(
    path.join(__dirname, "./invite/organization.hbs"),
    "utf8"
);

module.exports = {
    error: handlebars.compile(error),
    invite: {
        organization: handlebars.compile(inviteOrganization)
    }
};
