/** Construct a axis-aligned rectangle.
 * @see {@link rectangle} for the implementation.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of rectangle
 * @param {Array} [options.radius=[1,1]] - radius of rectangle, width and height
 * @returns {geom2} new 2D geometry
 *
 * @example
 * let mysquare = square({center: [5, 5], radius: 5})
 */
const square = require('./rectangle')

module.exports = square
