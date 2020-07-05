const mongoose = require("mongoose");

const User = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilePic: { data: Buffer, mimetype: String }
});

module.exports = mongoose.model("User", User);
