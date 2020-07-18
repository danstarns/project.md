const { ApolloServer } = require("apollo-server-express");
const { combineNodes } = require("idio-graphql");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { constraintDirective } = require("graphql-constraint-directive");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const nodes = require("./nodes/index.js");
const appliances = require("./appliances/index.js");
const context = require("./context.js");
const onConnect = require("./on-connect.js");
const onDisconnect = require("./on-disconnect.js");

const { typeDefs, resolvers, schemaDirectives } = combineNodes(
    nodes,
    appliances
);

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives,
    schemaTransforms: [constraintDirective()]
});

const server = new ApolloServer({
    schema,
    context,
    uploads: false
});

function startSubscriptions({ http }) {
    return new SubscriptionServer(
        {
            execute,
            subscribe,
            schema,
            onConnect,
            onDisconnect
        },
        {
            server: http,
            path: "/graphql"
        }
    );
}

module.exports = { server, startSubscriptions };
