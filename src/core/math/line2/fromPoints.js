const vec2 = require('../vec2')

const fromValues = require('./fromValues')

/**
 * Creates a new line2 that passes through the given points
 *
 * @param {vec2} p1 start point of the 2D line
 * @param {vec2} p2 end point of the 2D line
 * @returns {line2} a new unbounded 2D line
 */
const fromPoints = (p1, p2) => {
  let direction = vec2.subtract(p2, p1)

  let normal = vec2.normal(direction)
  vec2.normalize(normal, normal)

  let distance = vec2.dot(p1, normal)

  return fromValues(normal[0], normal[1], distance)
}

module.exports = fromPoints
