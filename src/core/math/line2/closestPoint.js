const vec2 = require('./vec2')

/**
 * FIXME Is this correct?
 */
const closestPoint = (line, point) => {
  let origin = origin(line)
  let distance = vec2.dot(point, direction(line))
  let closest = vec2.plus(origin, distance)
  return closest
}

module.exports = closestPoint
