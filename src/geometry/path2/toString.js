const vec2 = require('../../math/vec2')

const canonicalize = require('./canonicalize')

/**
 * Create a string representing the contents of the given path.
 * @returns {String} a representive string
 * @example
 * console.out(toString(path))
 */
const toString = (geometry) => {
  if (geometry.isCanonicalized) {
    let result = 'path (' + geometry.points.length + ' points, '+geometry.isClosed+'):\n[\n'
    geometry.points.forEach((point) => {
      result += '  ' + vec2.toString(point) + ',\n'
    })
    result += ']\n'
    return result
  }

  let result = 'path (' + geometry.basePoints.length + ' basePoints, '+geometry.isClosed+'):\n[\n'
  geometry.basePoints.forEach((point) => {
    result += '  ' + vec2.toString(point) + ',\n'
  })
  result += ']\n'
  return result
}

module.exports = toString
