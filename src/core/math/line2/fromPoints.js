const vec2 = require('./vec2')

/**
 * Creates a new line2 that passes through the given points
 *
 * @param {vec2} p1 start point of the line segment
 * @param {vec2} p2 end point of the line segment
 * @returns {line2} a new 2D line
 */
const fromPoints = (p1, p2) => {
  let direction = vec2.minus(p2, p1)

  let normal = vec2.normal(direction)
  normal = vec2.negated(normal)
  normal = vec2.unit(normal)

  let distance = vec2.dot(p1, normal)

  return fromValues(normal[0], normal[1], distance)
}

module.exports = fromValues
