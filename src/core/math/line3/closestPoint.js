const vec3 = require('../vec3')

/**
 * Determine the closest point on the given line to the given point.
 *
 * @param {vec3} point the point of reference
 * @param {line3} line the 3D line for calculations
 * @returns {vec3} a new point
 */
const closestPoint = (point, line) => {
  let lpoint = line[0]
  let ldirection = line[1]

  let a = vec3.dot(vec3.subtract(point, lpoint), ldirection)
  let b = vec3.dot(ldirection, ldirection)
  let t = a / b

  let closestpoint = vec3.add(lpoint, vec3.scale(t, ldirection))
  return closestpoint
}

module.exports = closestPoint
