/**
 * Determin if the given object is a 3D geometry.
 * @params {geom3} object - the object to interogate
 * @returns {true} if the object matches a geom3 based object
 */
const isA = (object) => {
  if (object && typeof object === 'object') {
    if ('basePolygons' in object && Array.isArray(object.basePolygons)) {
      return true
    }
  }
  return false
}

module.exports = isA
