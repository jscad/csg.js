/** center an object in 2D/3D space
 * @param {Boolean|Array} axis - either an array or single boolean to indicate which axis you want to center on
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to translate
 * @returns {CSG} new CSG object , translated by the given amount
 *
 * @example
 * let movedSphere = center(false, sphere())
 */
function center (axis, ...objects) { // v, obj or array
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  let object = _objects[0]

  if (_objects.length > 1) {
    for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
      object = object.union(_objects[i])
    }
  }
  return object.center(axis)
}

module.exports = center
