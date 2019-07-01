const flatten = require('../../utils/flatten')

const union = require('../booleans/union')

const hull = require('./hull')

/** Create a chain of hulled geometries from the given gemetries.
 * Essentially hull A+B, B+C, C+D, etc., then union the results.
 * Originally "Whosa whatsis" suggested "Chain Hull"
 * @param {...geom2} geometries - list of geometries from which to create hulls
 * @returns {geom2} new geometry
 *
 * @example:
 * let newshape = hullChain(rectangle({center: [-5,-5]}), circle({center: [0,0]}), rectangle({center: [5,5]}))
 */
const hullChain = (options, ...geometries) => {
  const defaults = { closed: false }
  let { closed } = Object.assign({}, defaults, options)

  geometries = flatten(geometries)
  if (geometries.length < 2) throw new Error('wrong number of arguments')

  if (closed === true && geometries[0] !== geometries[geometries.length - 1]) geometries.push(geometries[0])

  let hulls = []
  for (let i = 1; i < geometries.length; i++) {
    hulls.push(hull(geometries[i - 1], geometries[i]))
  }
  return union(hulls)
}

module.exports = hullChain
