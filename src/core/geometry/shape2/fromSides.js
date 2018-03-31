/** Construct a CAG from a list of `Side` instances.
 * this is a duplicate of CAG's fromSides to avoid circular dependency CAG => fromSides => CAG
 * @param {Side[]} sides - list of sides
 * @returns {CAG} new CAG object
 */
const fromSides = function (sides) {
  const CAG = require('./CAG')
  let cag = new CAG()
  cag.sides = sides
  return cag
}

module.exports = fromSides
