const { geom2 } = require('../../geometry')

const offsetFromPoints = require('./offsetFromPoints')

/**
 * Expand the given geometry (geom2) using the given options (if any).
 * @param {Object} options - options for expand
 * @param {Number} [options.delta=1] - delta (+/-) of expansion
 * @param {Integer} [options.segments=0] - number of segments when creating rounded corners, or zero for chamfer
 * @param {geom2} geometry - the geometry to expand
 * @returns {geom2} expanded geometry
 */
const expandGeom2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    segments: 0
  }
  let { delta, segments } = Object.assign({ }, defaults, options)

  // convert the geometry to outlines, and generate offsets from each
  let outlines = geom2.toOutlines(geometry)
  let newoutlines = outlines.map((outline) => {
    options = {
      delta: delta,
      closed: true,
      segments: segments
    }
    return offsetFromPoints(options, outline)
  })

  // create a composite geometry from the new outlines
  let allsides = newoutlines.reduce((sides, newoutline) => {
    return sides.concat(geom2.toSides(geom2.fromPoints(newoutline)))
  }, [])
  return geom2.create(allsides)
}

module.exports = expandGeom2
