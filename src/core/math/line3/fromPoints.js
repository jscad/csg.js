const vec3 = require('./vec3')

/**
 * Creates a new line3 that passes through the given points
 *
 * @param {vec3} p1 start point of the line segment
 * @param {vec3} p2 end point of the line segment
 * @returns {line3} a new 3D line
 */
const fromPoints = (p1, p2) => {
  let direction = vec3.minus(p2, p1)
  return fromData(p1, direction)
}

module.exports = fromPoints
