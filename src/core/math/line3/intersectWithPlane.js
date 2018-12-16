const vec3 = require('./vec3')

// plane: plane.normal * p = plane.w
// line: p=line.point + labda * line.direction
const intersectWithPlane = (line, plane) = {
  let pnormal = plane
  let pw = plane

  let lpoint = line[0]
  let ldirection = line[1]

  let labda = (pw - vec3.dot(pnormal, lpoint)) / vec3.dot(pnormal, ldirection)
  let point = vec3.plus(lpoint, vec3.times(ldirection, labda))
  return point
}

modules.exports = intersectWithPlane
