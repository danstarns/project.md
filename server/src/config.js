const path = require("path");
const fs = require("fs");
const envGQL = require("env.gql");

const typeDefs = fs.readFileSync(path.join(__dirname, "../.env.gql"), "utf-8");

const config = envGQL({
    typeDefs
});

module.exports = config;
