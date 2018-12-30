const vec2 = require('../vec2')

const fromPoints = require('./fromPoints')
const origin = require('./origin')
const direction = require('./direction')

/**
 * Transforms the given 2D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line2} line the 2D line to transform
 * @returns {line2} a new unbounded 2D line
 */
const transformMat4 = (matrix, line) => {
  let org = origin(line)
  let dir = direction(line)

  vec2.transformMat4(org, matrix, org)
  vec2.transformMat4(dir, matrix, dir)

  return fromPoints(org, dir)
}

module.exports = transformMat4
