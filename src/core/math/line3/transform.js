const vec3 = require('../vec3')

const clone = require('./clone')
const create = require('./create')
const fromPointAndDirection = require('./fromPointAndDirection')

/**
 * Transforms the given 3D line using the given matrix.
 *
 * @param {mat4} matrix matrix to transform with
 * @param {line3} line the 3D line to transform
 * @returns {line3} a new unbounded 3D line
 */
const transform = (...params) => {
  let out
  let matrix
  let line
  if (params.length === 2) {
    out = create()
    matrix = params[0]
    line = params[1]
  } else {
    out = params[0]
    matrix = params[1]
    line = params[2]
  }

  let point = line[0]
  let direction = line[1]
  let pointPlusDirection = vec3.add(point, direction)

  let newpoint = vec3.transformMat4(matrix, point)
  let newPointPlusDirection = vec3.transformMat4(matrix, pointPlusDirection)
  let newdirection = vec3.subtract(newPointPlusDirection, newpoint)

  return clone(out, fromPointAndDirection(newpoint, newdirection))
}

module.exports = transform
