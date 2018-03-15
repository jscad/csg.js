
/** translate an object in 2D/3D space
 * @param {Object} vector - 3D vector to translate the given object(s) by
 * @param {Object(s)|Array} objects either a single or multiple CSG/CAG objects to translate
 * @returns {CSG} new CSG object , translated by the given amount
 *
 * @example
 * let movedSphere = translate([10,2,0], sphere())
 */
function translate (vector, ...objects) {      // v, obj or array
  // workaround needed to determine if we are dealing with an array of objects
  const _objects = (objects.length >= 1 && objects[0].length) ? objects[0] : objects
  return _objects.map(object => object.translate(vector))
}

module.exports = translate
