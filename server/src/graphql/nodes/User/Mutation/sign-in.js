const { User } = require("../../../../models/index.js");
const { createJWT, comparePassword } = require("../../../../utils/index.js");

async function signIn(root, { input: { email, password } }) {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error(`Invalid credentials`);
        }

        if (!(await comparePassword(password, user.password))) {
            throw new Error(`Invalid credentials`);
        }

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

module.exports = signIn;
