const Redis = require("ioredis");
const Queue = require("bull");
const { REDIS_URI } = require("./config.js");
const debug = require("./debug.js")("Redis: ");

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

function connect() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
        debug(`Connecting to Redis: '${REDIS_URI}'`);

        await Promise.all([client.connect, subscriber.connect]);

        [client, subscriber].forEach((x) => x.on("error", reject));

        client.on("ready", () => {
            debug("Connected");

            resolve();
        });
    });
}

module.exports = { connect, dbs, queues };
