const Vector2 = require('../core/math/Vector2')
const {parseOptionAs2DVector, parseOptionAsFloat, parseOptionAsInt} = require('./optionParsers')

/** Construct a square/rectangle
 * @param {Object} [options] - options for construction
 * @param {Float} [options.size=1] - size of the square, either as array or scalar
 * @param {Boolean} [options.center=true] - wether to center the square/rectangle or not
 * @returns {CAG} new square
 *
 * @example
 * let square1 = square({
 *   size: 10
 * })
 */
const rectangle = () => {
  let v = [1, 1]
  let off
  let a = arguments
  let params = a[0]

  if (params && Number.isFinite(params)) v = [params, params]
  if (params && params.length) {
    v = a[0]
    params = a[1]
  }
  if (params && params.size && params.size.length) v = params.size

  off = [v[0] / 2, v[1] / 2]
  if (params && params.center === true) off = [0, 0]

  return _rectangle({center: off, radius: [v[0] / 2, v[1] / 2]})
}

/** Construct a rectangle. NON API !!!!
 * @param {Object} [options] - options for construction
 * @param {Vector2} [options.center=[0,0]] - center of rectangle
 * @param {Vector2} [options.radius=[1,1]] - radius of rectangle, width and height
 * @param {Vector2} [options.corner1=[0,0]] - bottom left corner of rectangle (alternate)
 * @param {Vector2} [options.corner2=[0,0]] - upper right corner of rectangle (alternate)
 * @returns {CAG} new CAG object
 */
const _rectangle = function (options) {
  options = options || {}
  let c, r
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('rectangle: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    let corner1 = parseOptionAs2DVector(options, 'corner1', [0, 0])
    let corner2 = parseOptionAs2DVector(options, 'corner2', [1, 1])
    c = corner1.plus(corner2).times(0.5)
    r = corner2.minus(corner1).times(0.5)
  } else {
    c = parseOptionAs2DVector(options, 'center', [0, 0])
    r = parseOptionAs2DVector(options, 'radius', [1, 1])
  }
  r = r.abs() // negative radii make no sense
  let rswap = new Vector2(r.x, -r.y)
  let points = [
    c.plus(r), c.plus(rswap), c.minus(r), c.minus(rswap)
  ]
  return fromPoints(points)
}

/** Construct a rounded rectangle.
 * @param {Object} [options] - options for construction
 * @param {Vector2} [options.center=[0,0]] - center of rounded rectangle
 * @param {Vector2} [options.radius=[1,1]] - radius of rounded rectangle, width and height
 * @param {Vector2} [options.corner1=[0,0]] - bottom left corner of rounded rectangle (alternate)
 * @param {Vector2} [options.corner2=[0,0]] - upper right corner of rounded rectangle (alternate)
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
  radius = radius.abs() // negative radii make no sense
  let roundradius = parseOptionAsFloat(options, 'roundradius', 0.2)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution2D)
  let maxroundradius = Math.min(radius.x, radius.y)
  maxroundradius -= 0.1
  roundradius = Math.min(roundradius, maxroundradius)
  roundradius = Math.max(0, roundradius)
  radius = new Vector2(radius.x - roundradius, radius.y - roundradius)
  let rect = rectangle({
    center: center,
    radius: radius
  })
  if (roundradius > 0) {
    rect = rect.expand(roundradius, resolution)
  }
  return rect
}

module.exports = rectangle
