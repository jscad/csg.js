const flatten = require('../../utils/flatten')
const areAllShapesTheSameType = require('../../utils/areAllShapesTheSameType')

const { vec2 } = require('../../math')

const { geom2, geom3 } = require('../../geometry')

const hullVectors2 = require('./hullVectors2')

/*
 * Create a convex hull of the given geom2 geometries.
 * @param {...geometries} geometries - list of geom2 geometries
 * @returns {geom2} new geometry
 */
const hullGeom2 = (...geometries) => {
  geometries = flatten(geometries)

  // extract the unique points from the geometries
  let uniquepoints = []
  geometries.forEach((geometry) => {
    let sides = geom2.toSides(geometry)
    sides.forEach((side) => {
      let index = uniquepoints.findIndex((unique) => vec2.equals(unique, side[0]))
      if (index < 0) uniquepoints.push(side[0])
    })
  })

  let hullpoints = hullVectors2(uniquepoints)

  // NOTE: more then three points are required to create a new geometry
  if (hullpoints.length < 3) return geom2.create()

  // assemble a new geometry from the list of points
  return geom2.fromPoints(hullpoints)
}

/*
 * Create a convex hull of the given geom3 geometries.
 * @param {...geometries} geometries - list of geom3 geometries
 * @returns {geom3} new geometry
 */
const hullGeom3 = (...geometries) => {
  throw new Error('sorry. hull of 3D geometries is not supported yet')
}

/** Create a convex hull of the given geometries.
 * @param {...geometries} geometries - list of geometries from which to create a hull
 * @returns {geometry} new geometry
 *
 * @example:
 * let myshape = hull(rectangle({center: [-5,-5]}), ellipse({center: [5,5]}))
 *
 * @example
 * +-------+           +-------+
 * |       |           |        \
 * |   A   |           |         \
 * |       |           |          \
 * +-------+           +           \
 *                  =   \           \
 *       +-------+       \           +
 *       |       |        \          |
 *       |   B   |         \         |
 *       |       |          \        |
 *       +-------+           +-------+
 */
const hull = (...geometries) => {
  geometries = flatten(geometries)
  if (geometries.length === 0) throw new Error('wrong number of arguments')

  if (!areAllShapesTheSameType(geometries)) {
    throw new Error('only unions of the same type are supported')
  }

  let geometry = geometries[0]
  // if (path.isA(geometry)) return hullPath2(geometries)
  if (geom2.isA(geometry)) return hullGeom2(geometries)
  if (geom3.isA(geometry)) return hullGeom3(geometries)

  // FIXME should this throw an error for unknown geometries?
  return geometry
}

module.exports = hull
