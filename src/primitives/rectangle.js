const vec2 = require('../math/vec2')

const geom2 = require('../geometry/geom2')

/** Construct a rectangle.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of rectangle
 * @param {Array} [options.radius=[1,1]] - radius of rectangle, width and height
 * @returns {geom2} new 2D geometry
 *
 * @example
 * let myrectangle = rectangle({center: [5, 5, 5], radius: [5, 10]})
 */
const rectangle = function (options) {
  const defaults = {
    center: [0, 0],
    radius: [1, 1]
  }
  const {radius, center} = Object.assign({}, defaults, options)

  const rswap = [radius[0], -radius[1]]

  const points = [
    vec2.subtract(center, radius),
    vec2.add(center, rswap),
    vec2.add(center, radius),
    vec2.subtract(center, rswap)
  ]
  return geom2.fromPoints(points)
}

module.exports = rectangle
