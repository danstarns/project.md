const {
    HTTP_PORT,
    JWT_SECRET,
    MONGODB_URI,
    REDIS_URI,
    CLIENT_URL,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SECURE,
    EMAIL_FROM,
    NODE_ENV
} = process.env;

const config = {
    HTTP_PORT: Number(HTTP_PORT),
    JWT_SECRET,
    MONGODB_URI,
    REDIS_URI,
    CLIENT_URL,
    EMAIL_HOST,
    EMAIL_PORT: Number(EMAIL_PORT),
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_SECURE: JSON.parse(EMAIL_SECURE),
    EMAIL_FROM,
    NODE_ENV
};

Object.entries(config).forEach(([key, value]) => {
    if (!value && value !== false) {
        throw new Error(`process.env.${key} required`);
    }
});

module.exports = config;
