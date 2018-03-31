const Properties = require('./Properties')

/** Class shape3
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
let shape3 = function () {
  this.polygons = []
  this.properties = new Properties()
  this.isCanonicalized = true
  this.isRetesselated = true
}

shape3.prototype = {
  /**
   * Helper function to chain operations on an object more easilly
   * This solid is not modified.
   * @returns {shape3} new shape3 object
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

module.exports = shape3
