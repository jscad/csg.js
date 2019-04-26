const {defaultResolution2D, defaultResolution3D} = require('../core/constants')

const {extrudeRotate} = require('../operations')

const circle = require('./circle')

/** Construct a torus by revolving a small circle (inner) about the circumference of a large (outer) circle.
 * @param {Object} [options] - options for construction
 * @param {Float} [options.innerRadius=1] - radius of small (inner) circle
 * @param {Float} [options.outerRadius=4] - radius of large (outer) circle
 * @param {Integer} [options.innerResolution=defaultResolution2D] - number of segments per 360 rotation
 * @param {Integer} [options.outerResolution=defaultResolution3D] - number of segments per 360 rotation
 * @param {Integer} [options.roti=0] - rotation angle of base circle
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let torus1 = torus({
 *   innerRadius: 10
 * })
 */
function torus (options) {
  const defaults = {
    innerRadius: 1,
    innerResolution: defaultResolution2D,
    outerRadius: 4,
    outerResolution: defaultResolution3D,
    roti: 0
  }
  let {innerRadius, innerResolution, outerRadius, outerResolution, roti} = Object.assign({}, defaults, options)

  if (innerRadius >= outerRadius) throw new Error('inner circle is two large to rotate about the outer circle')

  let innerCircle = circle({radius: innerRadius, center: [outerRadius, 0], resolution: innerResolution})

  //if (roti) innerCircle = innerCircle.transform(Matrix4x4.rotationZ(roti))

  options = {
    startAngle: 0,
    angle: 360,
    resolution: outerResolution
  }
  return extrudeRotate(options, innerCircle)
}

module.exports = torus
