/**
 * @param {Array[]} vectors - list of vectors
 * @param {Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 */
const fromData = (vectors, shared, plane) => {
  return { vectors: vectors, shared: shared, plane: plane }
}

module.exports = fromData
