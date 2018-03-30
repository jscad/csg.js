module.exports = translate
const create = require('./create')

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate (...params) {
  let out
  let a
  let v
  if (params.length === 2) {
    out = create()
    a = params[0]
    v = params[1]
  } else {
    out = params[0]
    a = params[1]
    v = params[2]
  }
  let x = v[0]
  let y = v[1]
  let z = v[2]
  let a00
  let a01
  let a02
  let a03
  let a10
  let a11
  let a12
  let a13
  let a20
  let a21
  let a22
  let a23

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3]
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7]
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11]

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23

    out[12] = a00 * x + a10 * y + a20 * z + a[12]
    out[13] = a01 * x + a11 * y + a21 * z + a[13]
    out[14] = a02 * x + a12 * y + a22 * z + a[14]
    out[15] = a03 * x + a13 * y + a23 * z + a[15]
  }

  return out
}
