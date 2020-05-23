const { IdioScalar } = require("idio-graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = new IdioScalar({
    name: "GraphQLDateTime",
    resolver: GraphQLDateTime
});
