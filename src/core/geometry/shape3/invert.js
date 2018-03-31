/**
 * Return a new CSG solid with solid and empty space switched.
 * This solid is not modified.
 * @returns {CSG} new CSG object
 * @example
 * let B = A.invert()
 */
function invert () {
  let flippedpolygons = this.polygons.map(function (p) {
    return p.flipped()
  })
  return CSG.fromPolygons(flippedpolygons)
  // TODO: flip properties?
}

module.exports = invert
