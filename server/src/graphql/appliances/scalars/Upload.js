const { IdioScalar } = require("idio-graphql");
const { GraphQLUpload } = require("graphql-upload");

module.exports = new IdioScalar({
    name: "Upload",
    resolver: GraphQLUpload
});
