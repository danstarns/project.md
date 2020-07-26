const debug = require("debug");

const prefix = "@Project.md/renderer: ";

function createComponent(namespace) {
    return debug(`${prefix}${namespace}`);
}

module.exports = createComponent;
