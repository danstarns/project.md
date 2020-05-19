const { REACT_APP_API_URL, REACT_APP_JWT_KEY } = process.env;

const config = { REACT_APP_API_URL, REACT_APP_JWT_KEY };

Object.entries(config).forEach(([key, value]) => {
  if (!value && value !== false) {
    throw new Error(`process.env.${key} required`);
  }
});

exports.REACT_APP_API_URL = REACT_APP_API_URL;
exports.REACT_APP_JWT_KEY = REACT_APP_JWT_KEY;
