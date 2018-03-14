const Plane = require('../../core/math/Plane')
const Vector3 = require('../../core/math/Vector3')

/** mirror an object in 2D/3D space
 * @param {Array} vector - the axes to mirror the object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to mirror
 * @returns {CSG} new CSG object , mirrored
 *
 * @example
 * let rotatedSphere = mirror([0.2,15,1], sphere())
 */
function mirror (vector, ...objects) {
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  let object = _objects[0]

  if (_objects.length > 1) {
    for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
      object = object.union(_objects[i])
    }
  }
  const plane = new Plane(new Vector3(vector[0], vector[1], vector[2]).unit(), 0)
  return object.mirrored(plane)
}

module.exports = mirror
