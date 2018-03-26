const Plane = require('../../core/math/Plane')
const Vector3 = require('../../core/math/Vector3')
const toArray = require('../../core/utils/toArray')
const {flatten} = require('../../core/utils')

/** mirror an object in 2D/3D space
 * @param {Array} vector - the axes to mirror the object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to mirror
 * @returns {CSG} new CSG object , mirrored
 *
 * @example
 * let rotatedSphere = mirror([0.2,15,1], sphere())
 */
function mirror (vector, ...objects) {
  const shapes = flatten(toArray(objects))

  const _objects = (shapes.length >= 1 && shapes[0].length) ? shapes[0] : shapes
  const plane = new Plane(new Vector3(vector[0], vector[1], vector[2]).unit(), 0)

  const results = _objects.map(function (object) {
    object.mirrored(plane)
  })

  return results.length === 1 ? results[0] : results
}

module.exports = mirror
