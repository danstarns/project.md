const debug = require("debug");

const prefix = "@Project.md: ";

function createComponent(namespace) {
    return debug(`${prefix}${namespace}`);
}

module.exports = createComponent;
