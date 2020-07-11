const http = require("http");
const express = require("express");
const cors = require("cors");
const { express: voyagerMiddleware } = require("graphql-voyager/middleware");
const { graphqlUploadExpress } = require("graphql-upload");
const path = require("path");
const { HTTP_PORT, NODE_ENV } = require("./config.js");
const debug = require("./debug.js")("App: ");
const graphql = require("./graphql/index.js");

const app = express();
const httpApp = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })
);
graphql.server.applyMiddleware({ app });

if (NODE_ENV === "production") {
    app.use("/", express.static("./build"));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../build/index.html"));
    });
}

function start() {
    debug(`App Starting on Port: '${HTTP_PORT}'`);

    if (NODE_ENV === "develop") {
        app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));

        debug(`Started Playground @ http://localhost:${HTTP_PORT}/graphql`);
        debug(`Started Voyager @ http://localhost:${HTTP_PORT}/voyager`);
    }

    return new Promise((resolve, reject) => {
        httpApp.listen(Number(HTTP_PORT), (err) => {
            if (err) {
                return reject(err);
            }

            debug("App Started");

            graphql.startSubscriptions({ http: httpApp });

            return resolve(app);
        });
    });
}

app.start = start;

module.exports = app;
