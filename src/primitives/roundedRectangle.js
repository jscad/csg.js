const {defaultResolution2D} = require('../../constants')

const Vector2D = require('../../math/Vector2')

const {parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt} = require('../optionParsers')

const expand = require('./expand')
const rectangle = require('./rectangle')

/** Construct a rounded rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2D} [options.center=[0,0]] - center of rounded rectangle
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded rectangle, width and height
 * @param {Vector2D} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
 * @param {Vector2D} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
 * @param {Number} [options.roundradius=0.2] - round radius of corners
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @returns {CAG} new CAG object
 *
 * @example
 * let r = roundedRectangle({
 *   center: [0, 0],
 *   radius: [5, 10],
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
const roundedRectangle = function (options) {
  options = options || {}
  let center, radius
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedRectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
    let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
    center = corner1.plus(corner2).times(0.5)
    radius = corner2.minus(corner1).times(0.5)
  } else {
    center = parseOptionAs2DVector(options, 'center', [0, 0])
    radius = parseOptionAs2DVector(options, 'radius', [1, 1])
  }
  let roundradius = parseOptionAsFloat(options, 'roundradius', 0.2)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)

  radius = radius.abs() // negative radii make no sense

  if (roundradius < 0) throw new Error('roundradius must be positive')

  let maxroundradius = Math.min(radius.x, radius.y) - 0.1
  roundradius = Math.min(roundradius, maxroundradius)

  radius = new Vector2D(radius.x - roundradius, radius.y - roundradius)

  // construct the rectangle
  let rect = rectangle({center: center, radius: radius})
  if (roundradius > 0) {
    rect = expand({radius: roundradius, resolution: resolution}, rect)
  }
  return rect
}

module.exports = roundedRectangle
