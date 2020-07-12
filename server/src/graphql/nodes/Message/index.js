const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Subscription = require("./Subscription/index.js");
const DataLoaders = require("./DataLoaders/index.js");
const Fields = require("./Fields/index.js");

const Message = new GraphQLNode({
    name: "Message",
    typeDefs: path.join(__dirname, "./Message.gql"),
    injections: {
        DataLoaders
    },
    resolvers: {
        Query,
        Mutation,
        Fields,
        Subscription
    }
});

module.exports = Message;
