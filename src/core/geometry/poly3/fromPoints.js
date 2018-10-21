const create = require('./create')

const _plane = require('../../math/plane/')
const _vec3 = require('../../math/vec3')

/**
 * Create a poly3 from the given points.
 *
 * @param {Array[]} points - list of points
 * @param {Polygon3.Shared} [shared=defaultShared] - shared property to apply
 * @param {Plane} [plane] - plane of the polygon
 *
 * @example
 * const points = [
 *   [0,  0, 0],
 *   [0, 10, 0],
 *   [0, 10, 10]
 * ]
 * const polygon = createFromPoints(points)
 */
const fromPoints = (points, shared, plane) => {
// TODO handle optional parameters; shared and plane
  let out = create()
  out.vertices = points.map((point) => { return _vec3.clone(point) } )
  out.plane = _plane.fromVec3s(out.vertices[0], out.vertices[1], out.vertices[2])
  return out
}

module.exports = fromPoints
