const Tree = require('../trees')
const canonicalize = require('./canonicalize')
const fromPoly3Array = require('./fromPoly3Array')

/**
   * Return a new geom3 representing space in this solid but
   * not in the given solids. Neither this solid nor the given solids are modified.
   * @param {geom3[]} csg - list of geom3 objects
   * @returns {geom3} new geom3 object
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
const difference = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPoly3Array([]);
    case 1: return geometries[0];
    default: {
      let baseGeometry = geometries[0]
      // TODO: Figure out why we do not subtract the union of the remainder of
      // the geometries. This approach chains subtractions rather than producing
      // a generational tree.
      for (let i = 1; i < geometries.length; i++) {
        const subtractGeometry = geometries[i];
        const baseTree = new Tree(canonicalize(baseGeometry).polygons)
        const subtractTree = new Tree(canonicalize(subtractGeometry).polygons)
        baseTree.invert()
        baseTree.clipTo(subtractTree)
        subtractTree.clipTo(baseTree, true)
        baseTree.addPolygons(subtractTree.allPolygons())
        baseTree.invert()
        baseGeometry = fromPoly3Array(baseTree.allPolygons())
      }
      return baseGeometry;
    }
  }
}

module.exports = difference
