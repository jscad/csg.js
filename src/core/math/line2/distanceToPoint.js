const vec2 = require('./vec2')

/**
 * ABS
 */
const distanceToPoint = (line, point) => {
  let distance = vec2.dot(point, line)
  distance = Math.abs(distance - line[2])
  return distance
}

module.exports = distanceToPoint
