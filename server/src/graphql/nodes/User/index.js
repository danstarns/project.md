const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Subscription = require("./Subscription/index.js");
const Fields = require("./Fields/index.js");
const DataLoaders = require("./DataLoaders/index.js");

const User = new GraphQLNode({
    name: "User",
    injections: {
        DataLoaders
    },
    typeDefs: path.join(__dirname, "./User.gql"),
    resolvers: {
        Query,
        Mutation,
        Subscription,
        Fields
    }
});

module.exports = User;
