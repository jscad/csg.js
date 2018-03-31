/** returns the triangles of this csg
 * @returns {Polygons} triangulated polygons
 */
const toTriangles = (_csg) => {
  let polygons = []
  _csg.polygons.forEach(function (poly) {
    let firstVertex = poly.vertices[0]
    for (let i = poly.vertices.length - 3; i >= 0; i--) {
      polygons.push(new Polygon3(
        [
          firstVertex,
          poly.vertices[i + 1],
          poly.vertices[i + 2]
        ],
          poly.shared,
          poly.plane))
    }
  })
  return polygons
}

module.exports = toTriangles
