const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Fields = require("./Fields/index.js");
const Subscription = require("./Subscription/index.js");
const DataLoaders = require("./DataLoaders/index.js");

const Notification = new GraphQLNode({
    name: "Notification",
    injections: {
        DataLoaders
    },
    typeDefs: path.join(__dirname, "./Notification.gql"),
    resolvers: {
        Query,
        Mutation,
        Fields,
        Subscription
    }
});

module.exports = Notification;
