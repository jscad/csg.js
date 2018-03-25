const canonicalize = require('./utils/canonicalize')
const {fromPolygons} = require('./CSGFactories')

  /**
   * Convert to a list of points.
   * @return {points[]} list of points in 2D space
   */
const toPoints = (cag) => {
  let points = cag.sides.map(function (side) {
    let v0 = side.vertex0
      // let v1 = side.vertex1
    return v0.pos
  })
    // due to the logic of fromPoints()
    // move the first point to the last
  if (points.length > 0) {
    points.push(points.shift())
  }
  return points
}

 /** Convert to compact binary form.
   * See fromCompactBinary.
   * @return {CompactBinary}
   */
const toCompactBinary = (_cag) => {
  let cag = canonicalize(_cag)
  let numsides = cag.sides.length
  let vertexmap = {}
  let vertices = []
  let numvertices = 0
  let sideVertexIndices = new Uint32Array(2 * numsides)
  let sidevertexindicesindex = 0
  cag.sides.map(function (side) {
    [side.vertex0, side.vertex1].map(function (v) {
      let vertextag = v.getTag()
      let vertexindex
      if (!(vertextag in vertexmap)) {
        vertexindex = numvertices++
        vertexmap[vertextag] = vertexindex
        vertices.push(v)
      } else {
        vertexindex = vertexmap[vertextag]
      }
      sideVertexIndices[sidevertexindicesindex++] = vertexindex
    })
  })
  let vertexData = new Float64Array(numvertices * 2)
  let verticesArrayIndex = 0
  vertices.map(function (v) {
    let pos = v.pos
    vertexData[verticesArrayIndex++] = pos._x
    vertexData[verticesArrayIndex++] = pos._y
  })
  let result = {
    'class': 'CAG',
    sideVertexIndices: sideVertexIndices,
    vertexData: vertexData
  }
  return result
}

/** convert a CAG to a CSG 'wall' of zero thickness
 * @param  {} z0
 * @param  {} z1
 */
const toCSGWall = function (cag, z0, z1) {
  let polygons = cag.sides.map(function (side) {
    return side.toPolygon3D(z0, z1)
  })
  return fromPolygons(polygons)
}

module.exports = {toPoints, toCompactBinary, toCSGWall}
