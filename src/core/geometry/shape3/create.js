const Properties = require('./Properties')

/** create shape3/ CSG
 * Holds a binary space partition tree representing a 3D solid. Two solids can
 * be combined using the `union()`, `subtract()`, and `intersect()` methods.
 * @constructor
 */
const create = function () {
  return {
    type: 'shape3',
    polygons: [],
    properties: new Properties(),
    isCanonicalized: true,
    isRetesselated: true
  }
}

// alternate, properties, declarative
const create2 = function () {
  return {
    type: 'shape3',
    polygons: [],
    properties: {},
    isCanonicalized: true,
    isRetesselated: true
  }
}

module.exports = create
