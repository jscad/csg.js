const {defaultResolution2D} = require('../../core/constants')
const Path2 = require('../../core/math/Path2')
const {parseOptionAs2DVector, parseOptionAsInt} = require('../optionParsers')
const {fromPath2} = require('../../core/CAGFactories')

/** Construct an ellispe.
 * @param {Object} [options] - options for construction
 * @param {Vector2} [options.center=[0,0]] - center of ellipse
 * @param {Vector2} [options.radius=[1,1]] - radius of ellipse, width and height
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 */
const ellipse = function (options) {
  options = options || {}
  let c = parseOptionAs2DVector(options, 'center', [0, 0])
  let r = parseOptionAs2DVector(options, 'radius', [1, 1])
  r = r.abs() // negative radii make no sense
  let res = parseOptionAsInt(options, 'resolution', defaultResolution2D)

  let e2 = new Path2([[c.x, c.y + r.y]])
  e2 = e2.appendArc([c.x, c.y - r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false
  })
  e2 = e2.appendArc([c.x, c.y + r.y], {
    xradius: r.x,
    yradius: r.y,
    xaxisrotation: 0,
    resolution: res,
    clockwise: true,
    large: false
  })
  e2 = e2.close()
  return fromPath2(e2)
}

module.exports = ellipse
