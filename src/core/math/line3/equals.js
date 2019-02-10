const vec3 = require('../vec3')

/**
 * Compare the given 3D lines for equality
 *
 * FIX: This does not compare lines for equality.
 *
 * @return {boolean} true if lines are equal
 */
const equals = (line1, line2) => {
  // compare directions (unit vectors)
  if (!vec3.equals(line1[1], line2[1])) return false

  // FIX: This is wrong -- it will compare false for any two distinct points
  // on the line.
  if (!vec3.equals(line1[0], line2[0])) return false

  // why would lines with the same slope (direction) and different points be equal?
  // let distance = distanceToPoint(line1, line2[0])
  // if (distance > EPS) return false

  return true
}

module.exports = equals
