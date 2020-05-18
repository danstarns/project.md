const { ApolloServer } = require("apollo-server-express");
const { combineNodes } = require("idio-graphql");

const nodes = require("./nodes/index.js");
const context = require("./context.js");

const { typeDefs, resolvers, schemaDirectives } = combineNodes(nodes);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context
});

module.exports = server;
