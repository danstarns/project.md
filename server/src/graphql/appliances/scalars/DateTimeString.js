const { IdioScalar } = require("idio-graphql");
const { GraphQLDateTime } = require("graphql-iso-date");

const DateTimeString = new IdioScalar({
    name: "DateTimeString",
    resolver: GraphQLDateTime
});

module.exports = DateTimeString;
