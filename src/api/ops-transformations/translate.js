
const toArray = require('../../core/utils/toArray')
const flatten = require('../../core/utils/flatten')

// refactor this into a type lookup
const shape2 = require('../../core/geometry/shape2')
const shape3 = require('../../core/geometry/shape3')
const {isShape2} = require('../../core/utils/typeChecks')

/** translate an object in 2D/3D space
 * @param {Object} vector - 3D vector to translate the given object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to translate
 * @returns {CSG} new CSG object , translated by the given amount
 *
 * @example
 * let movedSphere = translate([10,2,0], sphere())
 */
function translate (vector, ...objects) {      // v, obj or array
  const shapes = flatten(toArray(objects))
  const _objects = (shapes.length >= 1 && shapes[0].length) ? shapes[0] : shapes

  const results = _objects.map(function (object) {
    return object.translate(vector)
  })
  return results.length === 1 ? results[0] : results
}

module.exports = translate
