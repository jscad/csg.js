const Tree = require('../trees')
const canonicalize = require('./canonicalize')
const fromPoly3Array = require('./fromPoly3Array')

const union = (...geometries) => {
  switch (geometries.length) {
    case 0: return fromPoly3Array([])
    case 1: return geometries[0]
    default: {
      while (geometries.length >= 2) {
        const aGeometry = geometries.shift()
        const bGeometry = geometries.shift()
        const aTree = new Tree(canonicalize(aGeometry).polygons)
        const bTree = new Tree(canonicalize(bGeometry).polygons)

        aTree.clipTo(bTree, false)
        bTree.clipTo(aTree)
        bTree.invert()
        bTree.clipTo(aTree)
        bTree.invert()

        const polygons = [].concat(aTree.allPolygons(), bTree.allPolygons())
        // Enqueue the geometry to be unioned with another union of the same
        // generation (and hopefully same complexity)
        geometries.push(fromPoly3Array(polygons))
      }
      return geometries[0]
    }
  }
}

module.exports = union
