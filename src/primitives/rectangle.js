const vec2 = require('../math/vec2')

const geom2 = require('../geometry/geom2')

/** Construct an axis-aligned rectangle with four sides and four 90-degree angles.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of rectangle
 * @param {Array} [options.radius=[1,1]] - radius of rectangle, width and height
 * @returns {geom2} new 2D geometry
 *
 * @example
 * let myshape = rectangle({center: [5, 5, 5], radius: [5, 10]})
 */
const rectangle = (options) => {
  const defaults = {
    center: [0, 0],
    radius: [1, 1]
  }
  const {radius, center} = Object.assign({}, defaults, options)

  if (!Array.isArray(center)) throw new Error('center must be an array')
  if (center.length < 2) throw new Error('center must contain X and Y values')

  if (!Array.isArray(radius)) throw new Error('radius must be an array')
  if (radius.length < 2) throw new Error('radius must contain X and Y values')

  const rswap = [radius[0], -radius[1]]

  const points = [
    vec2.subtract(center, radius),
    vec2.add(center, rswap),
    vec2.add(center, radius),
    vec2.subtract(center, rswap)
  ]
  return geom2.fromPoints(points)
}

/** Construct an axis-aligned square with four equal sides and four 90-degree angles.
 * @see {@link rectangle} for additional options, as this is an alias fo rectangle
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of square
 * @param {Number} [options.radius=1] - radius of square
 * @returns {geom2} new 2D geometry
 *
 * @example
 * let myshape = square({center: [5, 5], radius: 5})
 */
const square = (options) => {
  const defaults = {
    center: [0, 0],
    radius: 1
  }
  let {center, radius} = Object.assign({}, defaults, options)

  // TODO check that radius is a number

  radius = [radius, radius]

  return rectangle({center: center, radius: radius})
}

module.exports = {
  rectangle,
  square
}
