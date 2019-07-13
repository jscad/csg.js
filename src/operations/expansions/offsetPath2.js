const { path2 } = require('../../geometry')

const offsetFromPoints = require('./offsetFromPoints')

/*
 * Create a offset geometry from the given path using the given options (if any).
 * @param {Object} options - options for offset
 * @param {Float} [options.delta=1] - delta of offset (+ to exterior, - from interior)
 * @param {Integer} [options.segments=0] - segments of rounded ends, or zero for chamfer
 * @param {path2} geometry - geometry from which to create the offset
 * @returns {path2} offset geometry, plus rounded corners
 */
const offsetPath2 = (options, geometry) => {
  const defaults = {
    delta: 1,
    closed: geometry.isClosed,
    segments: 0
  }
  let { delta, closed, segments } = Object.assign({ }, defaults, options)

  options = {
    delta: delta,
    closed: closed,
    segments: segments
  }
  let newpoints = offsetFromPoints(options, path2.toPoints(geometry))
  return path2.fromPoints({ closed: closed }, newpoints)
}

module.exports = offsetPath2
