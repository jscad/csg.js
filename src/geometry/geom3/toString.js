const poly3 = require('../poly3')

/**
 * Create a string representing the contents of the given geometry.
 * @returns {String} a representive string
 * @example
 * console.out(toString(geometry))
 */
const toString = function (geometry) {
  if (geometry.isCanonicalized) {
    let result = 'geom3 (' + geometry.polygons.length + ' polygons):\n'
    geometry.polygons.forEach(function (polygon) {
      result += '  ' + poly3.toString(polygon) + '\n'
    })
    return result
  }

  let result = 'geom3 (' + geometry.polygons.length + ' polygons):\n'
  geometry.polygons.forEach(function (polygon) {
    result += '  ' + poly3.toString(polygon) + '\n'
  })
  return result
}

module.exports = toString
