
/** create geom3
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
const create = function () {
  return {
    polygonData: new Float32Array(), // experimental !

    polygons: [],
    isCanonicalized: true,
    isRetesselated: true
  }
}

module.exports = create
