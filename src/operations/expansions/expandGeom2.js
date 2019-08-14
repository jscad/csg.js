const { geom2 } = require('../../geometry')

const offsetGeom2 = require('./offsetGeom2')

/**
 * Expand the given geometry (geom2) using the given options (if any).
 * @param {Object} options - options for expand
 * @param {Number} [options.delta=1] - delta (+/-) of expansion
 * @param {Integer} [options.segments=0] - number of segments when creating rounded corners, or zero for chamfer
 * @param {geom2} geometry - the geometry to expand
 * @returns {geom2} expanded geometry
 */
const expandGeom2 = (options, geometry) => {
  const sides = geom2.toSides(geometry)
  if (sides.length === 0) throw new Error('the given geometry cannot be empty')

  return offsetGeom2(options, geometry)
}

module.exports = expandGeom2
