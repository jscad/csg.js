/**
 * Creates a new line2 initialized with the given values
 *
 * @param {Number} x X coordinate of the normal
 * @param {Number} y Y coordinate of the normal
 * @param {Number} w length (positive) of the normal segment
 * @returns {line2} a new 2D line
 */
const fromValues = (x, y, w) => {
  const out = new Float32Array(3)
  out[0] = x
  out[1] = y
  out[2] = w
  return out
}

module.exports = fromValues
