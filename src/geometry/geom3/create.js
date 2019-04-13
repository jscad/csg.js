const mat4 = require('../../math/mat4')

/**
 * Create a new 3D geometry composed of polygons.
 * @returns {geom3} - a new geometry
 */
const create = function (polygons) {
  if (polygons === undefined) {
    polygons = [] // empty contents
  }
  return {
    basePolygons : polygons,
    polygons : [],
    isCanonicalized : false,
    isRetesselated : false,
    transforms : mat4.create()
  }
}

module.exports = create
