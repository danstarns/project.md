const { HTTP_PORT, MONGODB_URI, NODE_ENV } = process.env;

const config = { HTTP_PORT, MONGODB_URI, NODE_ENV };

Object.entries(config).forEach(([key, value]) => {
    if (!value && value !== false) {
        throw new Error(`process.env.${key} required`);
    }
});

module.exports = config;
