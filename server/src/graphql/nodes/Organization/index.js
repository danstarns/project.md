const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");

const Organization = new GraphQLNode({
    name: "Organization",
    typeDefs: path.join(__dirname, "./Organization.gql"),
    resolvers: {
        Query,
        Mutation
    }
});

module.exports = Organization;
