const app = require("./app.js");
const mongodb = require("./mongodb.js");
const debug = require("./debug.js")("Application: ");

async function main() {
    debug("Starting");

    await mongodb.connect();

    await app.start();

    debug("Started");
}

main();
