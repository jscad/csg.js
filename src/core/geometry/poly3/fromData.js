/**
 * @param {Array[]} vertices - list of vertices
 * @param {Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 */
const fromData = (vertices, shared, plane) => {
  return { vertices: vertices, shared: shared, plane: plane }
}

module.exports = fromData
