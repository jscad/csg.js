/**
 * Class CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
let CAG = function () {
  this.sides = []
  this.isCanonicalized = false
}

// added here to avoid circular dependencies
CAG.fromSides = function (sides) {
  let cag = new CAG()
  cag.sides = sides
  return cag
}

CAG.prototype = {
  /**
   * Helper function to chain operations on an object more easilly
   * This solid is not modified.
   * @returns {CSG} new CSG object
   * @example
   * let B = A
   *  .pipe(translate([10,20,0]))
   *  .pipe(union(C, D, E))
   */
  pipe: function (funtionToApply) {
    let params
    return funtionToApply(this, params)
  }

}

module.exports = CAG
