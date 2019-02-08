const mat4 = require('../../math/mat4')

/**
 * @typedef {Object} Geom3 - 3D Geometry
 * @property {Array} polygons - array of 3D polygons
 * @property {Boolean} isCanonicalized have overlapping tris been removed ?
 * @property {Boolean} isRetessellated has triangulation taken place ?
 */

/** create geom3
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
const create = () => {
  return {
    basePolygons: [],
    isCanonicalized: true,
    isRetessellated: true,
    polygons: [],
    transforms: mat4.identity(),
  }
}

module.exports = create
