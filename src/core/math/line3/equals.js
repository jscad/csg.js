const vec3 = require('./vec3')

const equals = (line1, line2) => {
  // compare directions
  if (!vec3.equals(line1[1], line2[1])) return false

  // compare points
  let distance = distanceToPoint(line1, line2[0])
  if (distance > EPS) return false
  return true
}

module.exports = equals
