function profilePic(root) {
    if (!root.profilePic.data) {
        return null;
    }

    return {
        data: root.profilePic.data.toString("base64"),
        mimetype: root.profilePic.mimetype
    };
}

module.exports = profilePic;
