function userCount(root) {
    return [root.creator, ...root.users].length;
}

module.exports = userCount;
