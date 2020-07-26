const debug = require("./debug.js")("Application: ");
const redis = require("./redis.js");
const mongodb = require("./mongodb.js");
const storage = require("./storage.js");
const renderer = require("./renderer.js");

async function main() {
    debug("Starting");

    await mongodb.connect();

    await storage.connect();

    await redis.connect();

    redis.queues.renderer.process(renderer);

    debug("Started");
}

main();
