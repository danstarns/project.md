const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");

const Task = new GraphQLNode({
    name: "Task",
    typeDefs: path.join(__dirname, "./Task.gql"),
    resolvers: {
        Query,
        Mutation
    }
});

module.exports = Task;
