const vec3 = require('../vec3')

/**
 * Determine the closest point on the given plane to the given line.
 *
 * The point of intersection will be invalid if parallel to the plane, e.g. NaN.
 *
 * @param {plane} plane the plane of reference
 * @param {line3} line the 3D line of reference
 * @returns {vec3} a new point
 */
const intersectWithPlane = (plane, line) => {
  // plane: plane.normal * p = plane.w
  let pnormal = plane
  let pw = plane[3]

  let lpoint = line[0]
  let ldirection = line[1]

  // point: p = line.point + labda * line.direction
  let a = (pw - vec3.dot(pnormal, lpoint))
  let b = vec3.dot(pnormal, ldirection)
  let labda = (pw - vec3.dot(pnormal, lpoint)) / vec3.dot(pnormal, ldirection)

  let point = vec3.add(lpoint, vec3.scale(labda, ldirection))
  return point
}

module.exports = intersectWithPlane
