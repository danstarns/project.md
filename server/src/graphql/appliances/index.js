const path = require("path");
const directives = require("./directives/index.js");
const scalars = require("./scalars/index.js");

module.exports = {
    directives,
    scalars,
    schemaGlobals: path.join(__dirname, "./Globals.gql")
};
