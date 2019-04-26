const {defaultResolution2D} = require('../core/constants')

const vec2 = require('../math/vec2')

const geom2 = require('../geometry/geom2')

/**
 * Construct a circle.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.resolution=defaultResolution2D] - number of segments per 360 rotation
 * @returns {geom2} new 2D geometry
 */
const circle = (options) => {
  const defaults = {
    center: [0, 0],
    radius: 1,
    resolution: defaultResolution2D
  }
  let {radius, resolution, center} = Object.assign({}, defaults, options)

  // convert to vector in ordre to perform math
  centerv = vec2.fromArray(center)

  let points = []
  for (let i = 0; i < resolution; i++) {
    let radians = 2 * Math.PI * i / resolution
    let point = vec2.fromAngleRadians(radians)
    vec2.scale(point, radius, point)
    vec2.add(point, centerv, point)
    points.push(point)
  }
  return geom2.fromPoints(points)
}

module.exports = circle
