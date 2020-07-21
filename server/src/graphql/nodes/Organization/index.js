const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Fields = require("./Fields/index.js");
const Subscription = require("./Subscription/index.js");
const DataLoaders = require("./DataLoaders/index.js");

const Organization = new GraphQLNode({
    name: "Organization",
    typeDefs: path.join(__dirname, "./Organization.gql"),
    injections: {
        DataLoaders
    },
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Fields
    }
});

module.exports = Organization;
