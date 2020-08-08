const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

User.plugin(mongoosePaginate);

module.exports = mongoose.model("User", User);
