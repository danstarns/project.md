const { GraphQLNode } = require("idio-graphql");
const path = require("path");
const Query = require("./Query/index.js");
const Mutation = require("./Mutation/index.js");
const Fields = require("./Fields/index.js");
const DataLoaders = require("./DataLoaders/index.js");

const Document = new GraphQLNode({
    name: "Document",
    injections: {
        DataLoaders
    },
    typeDefs: path.join(__dirname, "./Document.gql"),
    resolvers: {
        Query,
        Mutation,
        Fields
    }
});

module.exports = Document;
