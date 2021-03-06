const flatten = require('../../utils/flatten')

const { geom3 } = require('../../geometry')

const fromFakePolygons = require('./fromFakePolygons')
const to3DWalls = require('./to3DWalls')
const unionGeom3 = require('./unionGeom3')

/*
 * Return a new 2D geometry representing the total space in the given 2D geometries.
 * @param {...geom2} geometries - list of 2D geometries to union
 * @returns {geom2} new 2D geometry
 */
const union = (...geometries) => {
  geometries = flatten(geometries)
  const newgeometries = geometries.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry))

  let newgeom3 = unionGeom3(newgeometries)

  return fromFakePolygons(geom3.toPolygons(newgeom3))
}

module.exports = union
