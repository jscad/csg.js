const flatten = require('../../utils/flatten')
const areAllShapesTheSameType = require('../../utils/areAllShapesTheSameType')

const {geom2, geom3, path2} = require('../../geometry')

const subtractGeom2 = require('./subtractGeom2')

const subtractGeom3 = require('./subtractGeom3')

/**
 * Return a new geometry representing space in the first geometry but
 * not in the subsequent solids. None of the given geometries are modified.
 * @param {...geometries} geometries - list of geometries
 * @returns {geometry} new geometry
 * @example
 * let C = subtract(A, B)
 * @example
 * +-------+            +-------+
 * |       |            |       |
 * |   A   |            |       |
 * |    +--+----+   =   |    +--+
 * +----+--+    |       +----+
 *      |   B   |
 *      |       |
 *      +-------+
 */
const subtract = (...geometries) => {
  geometries = flatten(geometries)
  if (geometries.length === 0) throw new Error('wrong number of arguments')

  if (!areAllShapesTheSameType(geometries)) {
    throw new Error('only subtract of the types are supported')
  }

  let geometry = geometries[0]
  //if (path.isA(geometry)) return pathsubtract(matrix, geometries)
  if (geom2.isA(geometry)) return subtractGeom2(geometries)
  if (geom3.isA(geometry)) return subtractGeom3(geometries)
  return geometry
}

module.exports = subtract
