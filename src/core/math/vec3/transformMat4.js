module.exports = transformMat4
const create = require('./create')

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4 (...params) {
  let out
  let a
  let m
  if (params.length === 2) {
    out = create()
    a = params[0]
    m = params[1]
  } else {
    out = params[0]
    a = params[1]
    m = params[2]
  }

  let x = a[0]
  let y = a[1]
  let z = a[2]
  let w = m[3] * x + m[7] * y + m[11] * z + m[15]
  w = w || 1.0
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
  return out
}
