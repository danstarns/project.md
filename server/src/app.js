const express = require("express");
const cors = require("cors");
const { express: voyagerMiddleware } = require("graphql-voyager/middleware");
const { HTTP_PORT, NODE_ENV } = require("./config.js");
const debug = require("./debug.js")("App: ");
const graphql = require("./graphql/index.js");

const app = express();
app.use(express.json());
app.use(cors());
graphql.applyMiddleware({ app });

if (NODE_ENV === "production") {
    app.use("/", express.static("./build"));
}

function start() {
    debug(`App Starting on Port: '${HTTP_PORT}'`);

    if (NODE_ENV === "develop") {
        app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));

        debug(`Started Playground @ http://localhost:${HTTP_PORT}/graphql`);
        debug(`Started Voyager @ http://localhost:${HTTP_PORT}/voyager`);
    }

    return new Promise((resolve, reject) => {
        app.listen(Number(HTTP_PORT), (err) => {
            if (err) {
                return reject(err);
            }

            debug("App Started");

            return resolve(app);
        });
    });
}

app.start = start;

module.exports = app;
