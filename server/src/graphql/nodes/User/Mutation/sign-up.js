const { User } = require("../../../../models/index.js");
const {
    createJWT,
    hashPassword,
    constants
} = require("../../../../utils/index.js");
const storage = require("../../../../storage.js");
const redis = require("../../../../redis.js");

async function signUp(
    root,
    { input: { username, email, password, profilePic } }
) {
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

        const bucket = `user-${user._id.toString()}`;

        await storage.client.makeBucket(bucket);

        if (profilePic) {
            const file = await profilePic;
            const mimetype = file.mimetype;

            const fileName = `profile-pic${
                mimetype.includes("png") ? ".png" : ".jpeg"
            }`;

            const etag = await storage.client.putObject(
                bucket,
                fileName,
                file.createReadStream()
            );

            const [url] = await Promise.all([
                storage.client.presignedUrl(
                    "GET",
                    bucket,
                    fileName,
                    constants.IMAGE_URL_EXPIRE_SECONDS
                ),
                User.findByIdAndUpdate(user._id, {
                    $set: { profilePic: { etag, fileName, bucket } }
                })
            ]);

            await redis.dbs.imageUrls.set(
                etag,
                JSON.stringify({ etag, url }),
                "EX",
                constants.IMAGE_URL_EXPIRE_SECONDS - 100
            );
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

module.exports = signUp;
