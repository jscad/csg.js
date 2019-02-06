const Tree = require('../trees')
const canonicalize = require('./canonicalize')
const fromPoly3Array = require('./fromPoly3Array')

/**
   * Return a new Geom3 solid representing space in both this solid and
   * in the given solids.
   * Immutable: Neither this solid nor the given solids are modified.
   * @param {Geom3[]} geometry - list of Geom3 objects
   * @returns {Geom3} new Geom3 object
   * @example
   * let C = A.intersect(B)
   * @example
   * +-------+
   * |       |
   * |   A   |
   * |    +--+----+   =   +--+
   * +----+--+    |       +--+
   *      |   B   |
   *      |       |
   *      +-------+
   */
const intersection = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPoly3Array([])
    case 1: return geometries[0]
    default: {
      let baseGeometry = geometries[0]
      for (let i = 1; i < geometries.length; i++) {
        // result = intersectSub(result, geometries[i], islast, islast)
        const intersectGeometry = geometries[i]
        const baseTree = new Tree(baseGeometry.polygons)
        const intersectTree = new Tree(intersectGeometry.polygons)
        baseTree.invert()
        intersectTree.clipTo(baseTree)
        intersectTree.invert()
        baseTree.clipTo(intersectTree)
        intersectTree.clipTo(baseTree)
        baseTree.addPolygons(intersectTree.allPolygons())
        baseTree.invert()
        baseGeometry = fromPoly3Array(baseTree.allPolygons())
      }
      return baseGeometry
    }
  }
}

module.exports = intersection
