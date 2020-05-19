const { User } = require("../../../../models/index.js");
const { createJWT, hashPassword } = require("../../../../utils/index.js");

async function signUp(root, { input: { username, email, password } }) {
    try {
        const existingByUName = await User.findOne({ username });

        if (existingByUName) {
            throw new Error(`username: '${username}' already registered`);
        }

        const existingByEmail = await User.findOne({ email });

        if (existingByEmail) {
            throw new Error(`email: '${email}' already registered`);
        }

        const hash = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password: hash
        });

        const jwt = await createJWT({ sub: user._id.toString() });

        return {
            data: {
                jwt,
                user
            }
        };
    } catch (error) {
        return {
            data: null,
            error: {
                message: error.message
            }
        };
    }
}

module.exports = signUp;
