const hull = require('./hull')
const union = require('./union')

// TODO: This is not a primitive operation. Consider moving it to a library.

/** Create a chain hull of the given shapes.
 *
 * Originally "Whosa whatsis" suggested "Chain Hull", as described at
 * https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
 *
 * e.g.,
 * chainHull({}, A, B, C) is union(hull(A, B), hull(B, C)),
 * chainHull({ closed: true }, A, B, C) is union(hull(A, B), hull(B, C), hull(C, A).
 *
 * @param {Object} options - Options for hull.
 * @param {Boolean} options.closed - Closed chains hull the first and last shapes together.
 * @param {Array<shape2>} shapes - The shapes to sequentially hull together.
 * @returns {shape2} - The shape of the union of the chained hull operations.
 *
 * @example:
 * let hulled = chainHull({}, a, b, c);
 */

const chainHull = ({ closed = false }, ...geometries) => {
  const hulls = []
  const first = 0
  const last = geometries.length - 1
  for (let nth = 0; nth < last; nth++) {
    hulls.push(hull(geometries[nth], geometries[nth + 1]))
  }
  if (closed) {
    hulls.push(hull(geometries[last], geometries[first]))
  }
  return union(...hulls)
}

module.exports = chainHull
