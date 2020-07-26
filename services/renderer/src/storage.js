const Minio = require("minio");
const debug = require("./debug.js")("Storage: ");
const {
    S3_URL,
    S3_PORT,
    S3_USE_SSL,
    S3_ACCESS_KEY,
    S3_SECRET_KEY
} = require("./config.js");

const client = new Minio.Client({
    endPoint: S3_URL,
    port: S3_PORT,
    useSSL: S3_USE_SSL,
    accessKey: S3_ACCESS_KEY,
    secretKey: S3_SECRET_KEY
});

async function connect() {
    debug("Connecting");

    // Test the connection
    await client.listBuckets();

    debug("Connected");
}

module.exports = {
    client,
    connect
};
