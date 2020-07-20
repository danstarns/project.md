function userCount(root) {
    return [root.creator, ...root.admins, ...root.users].length;
}

module.exports = userCount;
