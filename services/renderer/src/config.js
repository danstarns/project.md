const {
    MONGODB_URI,
    REDIS_URI,
    HTTP_PORT,
    NODE_ENV,
    S3_URL,
    S3_PORT,
    S3_USE_SSL,
    S3_ACCESS_KEY,
    S3_SECRET_KEY
} = process.env;

const config = {
    MONGODB_URI,
    REDIS_URI,
    HTTP_PORT: Number(HTTP_PORT),
    NODE_ENV,
    S3_URL,
    S3_PORT: Number(S3_PORT),
    S3_USE_SSL: JSON.parse(S3_USE_SSL),
    S3_ACCESS_KEY,
    S3_SECRET_KEY
};

Object.entries(config).forEach(([key, value]) => {
    if (!value && value !== false) {
        throw new Error(`process.env.${key} required`);
    }
});

module.exports = config;
