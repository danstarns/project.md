const Redis = require("ioredis");
const Queue = require("bull");
const { REDIS_URI } = require("./config.js");
const debug = require("./debug.js")("Redis: ");
const { redisPubSub } = require("./utils/index.js");

/**
 * DBS MATRIX
[
    [0, "dbs"],
    [1, "queues"],
    [2, "pubsub"]
]
*/

function createClient(db) {
    return (type) => {
        switch (type) {
            case "client":
                return new Redis(REDIS_URI, { db });
            case "subscriber":
                return new Redis(REDIS_URI, { db });
            default:
                return new Redis(REDIS_URI, { db });
        }
    };
}

const dbs = {
    passwordReset: new Redis(REDIS_URI, { keyPrefix: "password-reset", db: 0 }),
    onlineUsers: new Redis(REDIS_URI, { keyPrefix: "online-users", db: 0 }),
    imageUrls: new Redis(REDIS_URI, { keyPrefix: "image-urls", db: 0 })
};

const queues = {
    email: new Queue("email", { createClient: createClient(1) })
};

const pubsubConnections = {
    pub: new Redis(REDIS_URI, {
        keyPrefix: "pub",
        db: 2,
        lazyConnect: true
    }),
    sub: new Redis(REDIS_URI, {
        keyPrefix: "sub",
        db: 2,
        lazyConnect: true
    })
};

const pubsub = redisPubSub({
    pub: pubsubConnections.pub,
    sub: pubsubConnections.sub
});

async function connect() {
    debug(`Connecting to Redis: '${REDIS_URI}'`);

    /* Deliberate connect to 1 and assume the others ok, will change if I use other Redis DB's */
    await pubsubConnections.sub.connect();

    debug("Connected");
}

module.exports = { connect, dbs, queues, pubsub };
