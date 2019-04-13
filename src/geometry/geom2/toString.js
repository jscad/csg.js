const vec2 = require('../../math/vec2')

/**
 * Create a string representing the contents of the given geometry.
 * @returns {String} a representive string
 * @example
 * console.out(toString(geometry))
 */
const toString = function (geometry) {
  if (geometry.isCanonicalized) {
    let result = 'geom2 (' + geometry.sides.length + ' sides):\n[\n'
    geometry.sides.forEach((side) => {
      result += '  [' + vec2.toString(side[0]) + ', ' + vec2.toString(side[1]) + ']\n'
    })
    result += ']\n'
    return result
  }

  let result = 'geom2 (' + geometry.baseSides.length + ' baseSides):\n[\n'
  geometry.baseSides.forEach((side) => {
    result += '  [' + vec2.toString(side[0]) + ', ' + vec2.toString(side[1]) + ']\n'
  })
  result += ']\n'
  return result
}

module.exports = toString
