const FuzzyFactory3 = require('../fuzzyfactory/FuzzyFactory3')

const fromPolygons = require('./fromPolygons')

/**
 * Returns a canonicalized version of the input geometry : ie every very close
 * points get deduplicated
 * @returns {Geom3}
 * @example
 * let rawGeometry = someGeometryMakingFunction()
 * let canonicalizedGeom = canonicalize(rawGeometry)
 */
const canonicalize = (geometry) => {
  if (geometry.isCanonicalized) {
    return geometry
  } else {
    const factory = new FuzzyFactory3()

    let newpolygons = []
    geometry.polygons.forEach(function (polygon) {
      let newpolygon = factory.getPolygon(polygon)

      // discard incomplete polygons
      if (newpolygon.vertices.length >= 3) {
        newpolygons.push(newpolygon)
      }
    })

    let result = fromPolygons(newpolygons)
    result.isCanonicalized = true
    result.isRetesselated = geometry.isRetesselated
    // TODO result.properties = geometry.properties
    return result
  }
}

module.exports = canonicalize
