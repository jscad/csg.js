/** scale an object in 2D/3D space
 * @param {Float|Array} scale - either an array or simple number to scale object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to scale
 * @returns {CSG} new CSG object , scaled by the given amount
 *
 * @example
 * let scaledSphere = scale([0.2,15,1], sphere())
 */
function scale (scale, ...objects) {
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  return _objects.map(object => object.scale(scale))
}

module.exports = scale
