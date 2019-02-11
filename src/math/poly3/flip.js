const clone = require('./clone')
const plane = require('../plane')

/**
 * Flip the give polygon to face the opposite direction.
 *
 * @param {poly3} polygon - the polygon to flip
 * @returns {poly3} a new poly3
 */
const flip = (polygon) => {
  const out = clone(polygon)
  // Reverse the vertices.
  out.reverse()
  out.plane = plane.flip(polygon.plane)
  return out
}

module.exports = flip
