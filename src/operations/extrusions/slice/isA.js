/**
 * Determin if the given object is a poly3.
 * @params {poly3} object - the object to interogate
 * @returns {true} if the object matches a poly3 based object
 */
const isA = (object) => {
  if (object && typeof object === 'object') {
    if ('edges' in object) {
      if (Array.isArray(object.edges)) {
        return true
      }
    }
  }
  return false
}

module.exports = isA
