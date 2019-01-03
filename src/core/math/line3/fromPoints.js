const vec3 = require('../vec3')

const fromData = require('./fromData')

/**
 * Creates a new 3D line that passes through the given points.
 *
 * @param {vec3} p1 start point of the line segment
 * @param {vec3} p2 end point of the line segment
 * @returns {line3} a new unbounded 3D line
 */
const fromPoints = (p1, p2) => {
  let direction = vec3.subtract(p2, p1)
  return fromData(p1, direction)
}

module.exports = fromPoints
