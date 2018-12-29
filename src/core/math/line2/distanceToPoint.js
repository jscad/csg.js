const vec2 = require('../vec2')

/**
 * Calculate the distance (positive) between the given point and line
 *
 * @return {Number} distance between line and point
 */
const distanceToPoint = (point, line) => {
  let distance = vec2.dot(point, line)
  distance = Math.abs(distance - line[2])
  return distance
}

module.exports = distanceToPoint
