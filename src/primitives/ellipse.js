const {defaultResolution2D} = require('../core/constants')

const vec2 = require('../math/vec2')

const geom2 = require('../geometry/geom2')

/** Construct an ellispe.
 * @see https://en.wikipedia.org/wiki/Ellipse
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of ellipse
 * @param {Array} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {geom2} new 2D geometry
 */
const ellipse = (options) => {
  const defaults = {
    center: [0, 0],
    radius: [1, 1],
    resolution: defaultResolution2D
  }
  let {radius, resolution, center} = Object.assign({}, defaults, options)

  const centerv = vec2.fromArray(center)
  const step = 2 * Math.PI / resolution // radians

  let points = []
  for (var i = 0 ; i < resolution ; i++) {
    var point = vec2.fromValues(radius[0] * Math.cos(step * i), radius[1] * Math.sin(step * i))
    vec2.add(point, centerv, point)
    points.push(point)
  }
  return geom2.fromPoints(points)
}

module.exports = ellipse
