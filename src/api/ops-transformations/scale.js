const toArray = require('../../core/utils/toArray')
const {flatten} = require('../../core/utils')

/** scale an object in 2D/3D space
 * @param {Float|Array} scale - either an array or simple number to scale object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to scale
 * @returns {CSG} new CSG object , scaled by the given amount
 *
 * @example
 * let scaledSphere = scale([0.2,15,1], sphere())
 */
function scale (scale, ...objects) {
  const shapes = flatten(toArray(objects))
  const _objects = (shapes.length >= 1 && shapes[0].length) ? shapes[0] : shapes

  const results = _objects.map(function (object) {
    return object.scale(scale)
  })
  return results.length === 1 ? results[0] : results
}

module.exports = scale
