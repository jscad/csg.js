const vec3 = require('../vec3')

const fromData = require('./fromData')

/**
 * Transforms the given 3D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line2} line the 3D line to transform
 * @returns {line2} a new unbounded 3D line
 */
const transform = (matrix, line) => {
  let point = line[0]
  let direction = line[1]
  let pointPlusDirection = vec3.add(point, direction)

  let newpoint = vec3.transformMat4(matrix, point)
  let newPointPlusDirection = vec3.transformMat4(matrix, pointPlusDirection)
  let newdirection = vec3.subtract(newPointPlusDirection, newpoint)

  return fromData(newpoint, newdirection)
}

module.exports = transform
