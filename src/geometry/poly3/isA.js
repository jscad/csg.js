/**
 * Determin if the given object is a 3D polygon.
 * @params {poly3} object - the object to interogate
 * @returns {true} if the object matches a poly3 based object
 */
const isA = (object) => {
  if ('vertices' in object && 'plane' in object) {
    if (Array.isArray(object.vertices)) {
      return true
    }
  }
  return false
}

module.exports = isA
