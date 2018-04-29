const create = require('./create')

/** Construct a CAG from a list of `Side` instances.
 * this is a duplicate of CAG's fromSides to avoid circular dependency CAG => fromSides => CAG
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
const fromSides = function (sides) {
  let shape2 = create()
  shape2.sides = sides
  return shape2
}

module.exports = fromSides
