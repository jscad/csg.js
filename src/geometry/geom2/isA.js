/**
 * Determin if the given object is a 2D geometry.
 * @params {geom2} object - the object to interogate
 * @returns {true} if the object matches a geom2 based object
 */
const isA = (object) => {
  if (object && typeof object === 'object') {
    if ('baseSides' in object && Array.isArray(object.baseSides)) {
      return true
    }
  }
  return false
}

module.exports = isA
