const vec3 = require('./vec3')

const closestPoint = (line, point) => {
  let lpoint = line[0]
  let ldirection = line[1]

  let a = vec3.dot(vec3.minus(point, lpoint), ldirection)
  let b = vec3.dot(ldirection, ldirection)
  let t = a / b

  let closestpoint = vec3.plus(lpoint, vec3.times(ldirection, t))
  return closestpoint
}

module.exports = closestPoint
