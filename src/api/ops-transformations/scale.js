/** scale an object in 2D/3D space
 * @param {Float|Array} scale - either an array or simple number to scale object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to scale
 * @returns {CSG} new CSG object , scaled by the given amount
 *
 * @example
 * let scaledSphere = scale([0.2,15,1], sphere())
 */
function scale (scale, ...objects) {         // v, obj or array
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  let object = _objects[0]

  if (_objects.length > 1) {
    for (let i = 1; i < _objects.length; i++) { // FIXME/ why is union really needed ??
      object = object.union(_objects[i])
    }
  }
  return object.scale(scale)
}

module.exports = scale
