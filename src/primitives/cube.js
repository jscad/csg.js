/** Construct an axis-aligned solid cube.
 * @see {@link cuboid} for the implementation.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of cuboid
 * @param {Array} [options.radius=[1,1,1]] - radius of cuboid
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let mycube = cube({center: [5, 5, 5], radius: 5})
 */
const cube = require('./cuboid')

module.exports = cube
