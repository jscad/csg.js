/**
   * Return a new Shape3 solid representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {Shape3[]} Shape3 - list of Shape3 objects
   * @returns {Shape3} new Shape3 object
   * @example
   * let C = A.subtract(B)
   * @example
   * +-------+            +-------+
   * |       |            |       |
   * |   A   |            |       |
   * |    +--+----+   =   |    +--+
   * +----+--+    |       +----+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const difference =  (shape, otherShape) => {
 
}

module.exports = difference
