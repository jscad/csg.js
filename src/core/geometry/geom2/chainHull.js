const hull = require('../../shape2/hull')
const union = require('../../shape2/union')

// FIXME: cleanup, clarify 'closed' parameter
/** create a chain hull of the given shapes
 * Originally "Whosa whatsis" suggested "Chain Hull" ,
 * as described at https://plus.google.com/u/0/105535247347788377245/posts/aZGXKFX1ACN
 * essentially hull A+B, B+C, C+D and then union those
 * @param {Object(s)|Array} objects either a single or multiple Geom2/Geom2 objects to create a chain hull around
 * @returns {Geom2} new Geom2 object ,which a chain hull of the inputs
 *
 * @example
 * let hulled = chainHull(rect(), circle())
 */
const chainHull = (params, objects) => {
  /*
  const defaults = {
    closed: false
  }
  const closed = Object.assign({}, defaults, params) */
  let a = arguments
  let closed = false
  let j = 0

  if (a[j].closed !== undefined) {
    closed = a[j++].closed
  }

  if (a[j].length) { a = a[j] }

  let hulls = []
  let hullsAmount = a.length - (closed ? 0 : 1)
  for (let i = 0; i < hullsAmount; i++) {
    hulls.push(hull(a[i], a[(i + 1) % a.length]))
  }
  return union(hulls)
}

module.exports = chainHull
