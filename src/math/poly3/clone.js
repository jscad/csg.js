const map = require('./map')

/**
 * Create a deep clone of the given polygon
 *
 * @param {vec3} poly3 - polygon to clone
 * @returns {vec3} clone of the polygon
 */
// FIXME: Why are we doing deep copies?
const clone = original => map(original)

module.exports = clone
