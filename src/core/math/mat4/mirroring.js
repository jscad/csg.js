const create = require('./create')
const fromValues = require('./fromValues')

/**
 * m the mat4 by the dimensions in the given vec3
 * create an affine matrix for mirroring into an arbitrary plane:
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to mirror
 * @param {vec4} plane the vec4 to mirror the matrix by
 * @returns {mat4} out
 */
const mirroring = (...params) => {
  let out
  let a
  let plane
  if (params.length === 2) {
    out = create()
    plane = params[0]
    a = params[1]
  } else {
    out = params[0]
    plane = params[1]
    a = params[2]
  }
  const [nx, ny, nz, w] = plane
  const elements = [
    (1.0 - 2.0 * nx * nx), (-2.0 * ny * nx), (-2.0 * nz * nx), 0,
    (-2.0 * nx * ny), (1.0 - 2.0 * ny * ny), (-2.0 * nz * ny), 0,
    (-2.0 * nx * nz), (-2.0 * ny * nz), (1.0 - 2.0 * nz * nz), 0,
    (2.0 * nx * w), (2.0 * ny * w), (2.0 * nz * w), 1
  ]
  return fromValues(...elements)
}

module.exports = mirroring
