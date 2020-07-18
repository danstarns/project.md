const {
    HTTP_PORT,
    JWT_SECRET,
    MONGODB_URI,
    REDIS_URI,
    CLIENT_URL,
    API_URL,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SECURE,
    EMAIL_FROM,
    NODE_ENV,
    S3_URL,
    S3_PORT,
    S3_USE_SSL,
    S3_ACCESS_KEY,
    S3_SECRET_KEY
} = process.env;

const config = {
    HTTP_PORT: Number(HTTP_PORT),
    JWT_SECRET,
    MONGODB_URI,
    REDIS_URI,
    CLIENT_URL,
    API_URL,
    EMAIL_HOST,
    EMAIL_PORT: Number(EMAIL_PORT),
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SECURE: JSON.parse(EMAIL_SECURE),
    EMAIL_FROM,
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
