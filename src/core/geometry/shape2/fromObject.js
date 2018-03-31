const fromSides = require('./fromSides')

/** Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
const fromObject = function (obj) {
  let sides = obj.sides.map(function (s) {
    return Side.fromObject(s)
  })
  let cag = fromSides(sides)
  cag.isCanonicalized = obj.isCanonicalized
  return cag
}

module.exports = fromObject
