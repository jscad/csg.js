const {defaultResolution2D} = require('../core/constants')

const path2 = require('../geometry/path2')
const appendArc = require('../operations/appendArc')

const geom2 = require('../geometry/geom2')

/** Construct an ellispe.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0]] - center of ellipse
 * @param {Array} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {geom2} new 2D geometry
 */
const ellipse = function (options) {
  const defaults = {
    center: [0, 0],
    radius: [1, 1],
    resolution: defaultResolution2D
  }
  let {radius, resolution, center} = Object.assign({}, defaults, options)

  // use the path geometry to create the outline of the ellipse
  let e2 = path2.fromPoints({}, [[center[0], center[1] + radius[1]]])
  e2 = appendArc(
    {
      radius: radius,
      xaxisrotation: 0,
      resolution: resolution,
      clockwise: false,
      large: false
    },
    [center[0], center[1] - radius[1]],
    e2)
  e2 = appendArc(
    {
      radius: radius,
      xaxisrotation: 0,
      resolution: resolution,
      clockwise: false,
      large: false
    },
    [center[0], center[1] + radius[1]],
    e2)
  e2 = path2.close(e2) // make sure path is closed and proper
  const points = path2.toPoints(e2)
  return geom2.fromPoints(points)
}

module.exports = ellipse
