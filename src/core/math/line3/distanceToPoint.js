const vec3 = require('./vec3')

const distanceToPoint = (line, point) = {
  let closest = closestPoint(line, point)
  let distancevector = vec3.minus(point, closest)
  let distance = vec3.length(distancevector)
  return distance
}

module.exports = distanceToPoint
