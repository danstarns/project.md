const { ApolloServer } = require("apollo-server-express");
const { combineNodes } = require("idio-graphql");

const nodes = require("./nodes/index.js");
const appliances = require("./appliances/index.js");
const context = require("./context.js");

const { typeDefs, resolvers, schemaDirectives } = combineNodes(
    nodes,
    appliances
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context
});

module.exports = server;
