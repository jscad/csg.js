const vec3 = require('./vec3')

const transform = (line, matrix) = {
  let point = line[0]
  let direction = line[0]
  let pointPlusDirection = vec3.plus(point, direction)

  let newpoint = vec3.transformMat4(point, matrix)
  let newPointPlusDirection = vec3.transformMat4(pointPlusDirection, matrix)
  let newdirection = vec3.minus(newPointPlusDirection, newpoint)

  return fromData(newpoint, newdirection)
}

modules.exports = transform
