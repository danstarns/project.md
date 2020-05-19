const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

function createJWT(data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, JWT_SECRET, (err, token) => {
            if (err) {
                return reject(err);
            }

            return resolve(token);
        });
    });
}

module.exports = createJWT;
