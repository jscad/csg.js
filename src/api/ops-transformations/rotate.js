const toArray = require('../../core/utils/toArray')
const {flatten, isArray} = require('../../core/utils')

/** rotate an object in 2D/3D space
 * @param {Float|Array} rotation - either an array or simple number to rotate object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to rotate
 * @returns {CSG} new CSG object , rotated by the given amount
 *
 * @example
 * let rotatedSphere = rotate([0.2,15,1], spheroid())
 * rotate(r,[x,y,z],o) ????
 * rotate([x,y,z],o) ????
 **/
function rotate (options, ...objects) {
  const defaults = {
    angle: 1,
    axes: [0, 0, 0]
  }
  if (isArray(options)) {
    options.axes = options
  }
  const {angle, axes} = Object.assign({}, defaults, options)
  objects = flatten(toArray(objects))

  const results = objects.map(function (object) {
    if (angle !== 1) {
      return object.rotate([0, 0, 0], axes, angle)
    } else {
      return object.rotateX(axes[0]).rotateY(axes[1]).rotateZ(axes[2])
    }
  })

  // if there is more than one result, return them all , otherwise a single one
  return results.length === 1 ? results[0] : results
}

module.exports = rotate
