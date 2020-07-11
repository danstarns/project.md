const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Subscription = require("./Subscription/index.js");

const Message = new GraphQLNode({
    name: "Message",
    typeDefs: path.join(__dirname, "./Message.gql"),
    resolvers: {
        Query,
        Mutation,
        Subscription
    }
});

module.exports = Message;
