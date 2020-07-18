const app = require("./app.js");
const mongodb = require("./mongodb.js");
const redis = require("./redis.js");
const storage = require("./storage.js");
const subscribers = require("./subscribers/index.js");
const debug = require("./debug.js")("Application: ");

async function main() {
    debug("Starting");

    await mongodb.connect();

    await storage.connect();

    await redis.connect();

    await subscribers.start();

    await app.start();

    debug("Started");
}

main();
