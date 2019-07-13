const { geom3 } = require('../../geometry')

const union = require('../booleans/union')

const expandShell = require('./expandShell')

/**
 * Expand the given geometry (geom3) using the given options (if any).
 * @param {Object} options - options for expand
 * @param {Number} [options.delta=1] - delta (+/-) of expansion
 * @param {Integer} [options.segments=defaultResolution3D] - number of segments when creating rounded corners
 * @param {geom3} geometry - the geometry to expand
 * @returns {geom3} expanded geometry
 */
const expandGeom3 = (options, geometry) => {
  const polygons = geom3.toPolygons(geometry)
  if (polygons.length === 0) throw new Error('the given geometry cannot be empty')

  let expanded = expandShell(options, geometry)
  return union(geometry, expanded)
}

module.exports = expandGeom3
