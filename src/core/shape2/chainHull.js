const hull = require('./hull')
const union = require('./union')

// TODO: This is not a primitive operation. Consider moving it to a library.

/** create a chain hull of the given shapes
 * Originally "Whosa whatsis" suggested "Chain Hull" ,
 * as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
 * essentially chainHull({}, A, B, C) is union(hull(A, B), hull(B, C)),
 * and chainHull({ closed: true }, A, B, C) is union(hull(A, B), hull(B, C), hull(C, A).
 *
 * @param {options} geometries either a single or multiple Geom2 objects to create a chain hull around
 * @param {...geometries} a sequence of 
 * @returns {shape} new shape2, being a union of the chained hull operations.
 *
 * @example:
 * let hulled = chainHull({}, rect({ size: [1, 1] }), circle({ r: 1 }))
 */

const chainHull = ({ closed=false }, ...geometries) => {
  const hulls = [];
  const first = 0;
  const last = geometries.length - 1;
  for (let nth = 0; nth < last; nth++) {
    hulls.push(hull(geometries[nth], geometries[nth + 1]));
  }
  if (closed) {
    hulls.push(hull(geometries[last], geometries[first]));
  }
  return union(...hulls);
}

module.exports = chainHull
