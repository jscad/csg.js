/**
 * Performs a shallow copy of the give path.
 * @params {path} path - the path to clone
 * @returns {path} new path
 */
const clone = (path) => Object.assign({}, path)

module.exports = clone
