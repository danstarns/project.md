const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Fields = require("./Fields/index.js");

const Project = new GraphQLNode({
    name: "Project",
    typeDefs: path.join(__dirname, "./Project.gql"),
    resolvers: {
        Query,
        Mutation,
        Fields
    }
});

module.exports = Project;
