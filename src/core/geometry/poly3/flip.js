const create = require('./create')

const _plane = require('../../math/plane/')
const _vec3 = require('../../math/vec3')

/**
 * Flip the give polygon to face the opposite direction.
 *
 * @param {poly3} polygon - the polygon to flip
 * @returns {poly3} a new poly3
 */
const flip = (polygon) => {
  const out = create()
  out.vectors = polygon.vectors.reverse()
  out.plane = _plane.flip(polygon.plane)
  return out
}

module.exports = flip
