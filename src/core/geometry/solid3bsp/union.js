const Tree = require('../trees')
const fromPoly3Array = require('./fromPolygonArray')

const union = geometries => {
  switch (geometries.length) {
    case 0: return fromPoly3Array([])
    case 1: return geometries[0]
    default: {
      while (geometries.length >= 2) {
        const aGeometry = geometries.shift()
        const bGeometry = geometries.shift()
        const aTree = new Tree(aGeometry.polygons)
        const bTree = new Tree(bGeometry.polygons)

        aTree.clipTo(bTree, false)
        bTree.clipTo(aTree)
        bTree.invert()
        bTree.clipTo(aTree)
        bTree.invert()
        const polygons = [].concat(a.allPolygons(), b.allPolygons())

        // Enqueue the geometry to be unioned with another union of the same
        // generation (and hopefully same complexity)
        geometries.push(fromPoly3Array(polygons))
      }
      return geometries[0];
    }
  }
}

module.exports = union
