const Redis = require("ioredis");
const Queue = require("bull");
const util = require("util");
const { REDIS_URI } = require("./config.js");
const debug = require("./debug.js")("Redis: ");

const sleep = util.promisify(setTimeout);

const options = { enableReadyCheck: true };

const client = new Redis(REDIS_URI, options);
const subscriber = new Redis(REDIS_URI, options);

function createClient(type) {
    switch (type) {
        case "client":
            return client;
        case "subscriber":
            return subscriber;
        default:
            return new Redis(REDIS_URI, options);
    }
}

const dbs = {
    passwordReset: new Redis(REDIS_URI, { keyPrefix: "password-reset" })
};

const queues = {
    email: new Queue("email", { createClient })
};

async function connect() {
    debug(`Connecting to Redis: '${REDIS_URI}'`);

    await Promise.all([client.connect, subscriber.connect]);

    while (client.status !== "ready") {
        // eslint-disable-next-line no-await-in-loop
        await sleep(100);
        // eslint-disable-next-line no-continue
        continue;
    }
}

module.exports = { connect, dbs, queues };
