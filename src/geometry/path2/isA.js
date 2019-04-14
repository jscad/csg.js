/**
 * Determin if the given object is a path2 geometry.
 * @params {object} object - the object to interogate
 * @returns {true} if the object matches a path2 based object
 */
const isA = (object) => {
  if (object && typeof object === 'object') {
    // see create for the required attributes and types
    if ('basePoints' in object && 'transforms' in object && 'isCanonicalized' in object && 'isClosed' in object) {
      // NOTE: transforms should be a TypedArray, which has a read-only length
      if (Array.isArray(object.basePoints) && 'length' in object.transforms) {
        return true
      }
    }
  }
  return false
}

module.exports = isA
