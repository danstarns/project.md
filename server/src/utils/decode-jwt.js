const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

function decodeJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return reject(err);
            }

            const { sub } = decoded;

            return resolve({ sub });
        });
    });
}

module.exports = decodeJWT;
