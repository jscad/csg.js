const vec2 = require('../vec2')

const transform = (line, matrix) => {
  let origin = vec2.fromValues(0, 0)
  let neworigin = vec2.transformMat4(origin, matrix)
  let neworiginPlusNormal = vec2.transformMat4(line, matrix)
  let newnormal = vec2.minus(neworiginPlusNormal, neworigin)

  let pointOnPlane = origin(line)
  let newpointOnPlane = vec2.transformMat4(pointOnPlane, matrix)
  let neww = vec2.dot(newnormal, newpointOnPlane)

  return fromValues(newnormal[0], newnormal[1], neww)
}

module.exports = transform
