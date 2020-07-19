const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: {
        etag: String,
        fileName: String,
        bucket: String
    }
});

module.exports = mongoose.model("User", User);
