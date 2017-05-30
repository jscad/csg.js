const CSG = require('./CSG')
const Vector3D = require('./Vector3D')

/** Construct a CSG solid from a list of `CSG.Polygon` instances.
 * @param {CSG.Polygon[]} polygons - list of polygons
 * @returns {CSG} new CSG object
 */
function fromPolygons (polygons) {
  let csg = new CSG()
  csg.polygons = polygons
  csg.isCanonicalized = false
  csg.isRetesselated = false
  return csg
}

/** Construct a CSG solid from a list of pre-generated slices.
 * See CSG.Polygon.prototype.solidFromSlices() for details.
 * @param {Object} options - options passed to solidFromSlices()
 * @returns {CSG} new CSG object
 */
function fromSlices (options) {
  return (new CSG.Polygon.createFromPoints([
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
  ])).solidFromSlices(options)
}

/** Reconstruct a CSG solid from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CSG} new CSG object
 */
function fromObject (obj) {
  var polygons = obj.polygons.map(function (p) {
    return CSG.Polygon.fromObject(p)
  })
  var csg = CSG.fromPolygons(polygons)
  csg.isCanonicalized = obj.isCanonicalized
  csg.isRetesselated = obj.isRetesselated
  return csg
}

/** Reconstruct a CSG from the output of toCompactBinary().
 * @param {CompactBinary} bin - see toCompactBinary().
 * @returns {CSG} new CSG object
 */
function fromCompactBinary (bin) {
  if (bin['class'] !== 'CSG') throw new Error('Not a CSG')
  let planes = [],
    planeData = bin.planeData,
    numplanes = planeData.length / 4,
    arrayindex = 0,
    x, y, z, w, normal, plane
  for (var planeindex = 0; planeindex < numplanes; planeindex++) {
    x = planeData[arrayindex++]
    y = planeData[arrayindex++]
    z = planeData[arrayindex++]
    w = planeData[arrayindex++]
    normal = Vector3D.Create(x, y, z)
    plane = new CSG.Plane(normal, w)
    planes.push(plane)
  }

  var vertices = [],
    vertexData = bin.vertexData,
    numvertices = vertexData.length / 3,
    pos, vertex
  arrayindex = 0
  for (var vertexindex = 0; vertexindex < numvertices; vertexindex++) {
    x = vertexData[arrayindex++]
    y = vertexData[arrayindex++]
    z = vertexData[arrayindex++]
    pos = Vector3D.Create(x, y, z)
    vertex = new CSG.Vertex(pos)
    vertices.push(vertex)
  }

  var shareds = bin.shared.map(function (shared) {
    return CSG.Polygon.Shared.fromObject(shared)
  })

  var polygons = [],
    numpolygons = bin.numPolygons,
    numVerticesPerPolygon = bin.numVerticesPerPolygon,
    polygonVertices = bin.polygonVertices,
    polygonPlaneIndexes = bin.polygonPlaneIndexes,
    polygonSharedIndexes = bin.polygonSharedIndexes,
    numpolygonvertices, polygonvertices, shared, polygon // already defined plane,
  arrayindex = 0
  for (var polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
    numpolygonvertices = numVerticesPerPolygon[polygonindex]
    polygonvertices = []
    for (var i = 0; i < numpolygonvertices; i++) {
      polygonvertices.push(vertices[polygonVertices[arrayindex++]])
    }
    plane = planes[polygonPlaneIndexes[polygonindex]]
    shared = shareds[polygonSharedIndexes[polygonindex]]
    polygon = new CSG.Polygon(polygonvertices, shared, plane)
    polygons.push(polygon)
  }
  let csg = CSG.fromPolygons(polygons)
  csg.isCanonicalized = true
  csg.isRetesselated = true
  return csg
}

module.exports = {fromPolygons, fromSlices, fromObject, fromCompactBinary}
