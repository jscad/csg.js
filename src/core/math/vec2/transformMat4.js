module.exports = transformMat4
const create = require('./create')

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
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
  out[0] = m[0] * x + m[4] * y + m[12]
  out[1] = m[1] * x + m[5] * y + m[13]
  return out
}
  // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
    // Returns a new Vector2D