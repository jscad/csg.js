const toArray = require('../../core/utils/toArray')
const {flatten, isArray} = require('../../core/utils')

/** rotate an object in 2D/3D space
 * @param {Float|Array} rotation - either an array or simple number to rotate object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to rotate
 * @returns {CSG} new CSG object , rotated by the given amount
 *
 * @example
 * let rotatedSphere = rotate([0.2,15,1], spheroid())
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

  /* let o
  let i
  let v
  let r = 1
  let a = arguments
  if (!a[0].length) {        // rotate(r,[x,y,z],o)
    r = a[0]
    v = a[1]
    i = 2
    if (a[2].length) { a = a[2]; i = 0 }
  } else {                   // rotate([x,y,z],o)
    v = a[0]
    i = 1
    if (a[1].length) { a = a[1]; i = 0 }
  }
  for (o = a[i++]; i < a.length; i++) {
    o = o.union(a[i])
  }
  if (r !== 1) {
    return o.rotate([0, 0, 0], v, r)
  } else {
    return o.rotateX(v[0]).rotateY(v[1]).rotateZ(v[2])
  }*/

  // if there is more than one result, return them all , otherwise a single one
  return results.length === 1 ? results[0] : results
}

module.exports = rotate
