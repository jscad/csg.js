const { geom2 } = require('../../geometry')

const { arePointsInside } = require('./inside')

const offsetFromPoints = require('./offsetFromPoints')

/*
 * Create a offset geometry from the given geom2 using the given options (if any).
 * @param {Object} options - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {geom2} geometry - geometry from which to create the offset
 * @returns {geom2} offset geometry, plus rounded corners
 */
const offsetGeom2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    segments: 0
  }
  let { delta, segments } = Object.assign({ }, defaults, options)

  // convert the geometry to outlines, and generate offsets from each
  let outlines = geom2.toOutlines(geometry)
  let newoutlines = outlines.map((outline) => {
    let level = outlines.reduce((acc, polygon) => {
      return acc + arePointsInside(outline, polygon)
    }, 0)
    let outside = (level % 2) === 0

    options = {
      delta: outside ? delta : -delta,
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

module.exports = offsetGeom2
