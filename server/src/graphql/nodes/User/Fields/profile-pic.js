function profilePic(root) {
    if (!root.profilePic) {
        return null;
    }

    return {
        data: root.profilePic.data.toString("base64"),
        contentType: root.profilePic.contentType
    };
}

module.exports = profilePic;
