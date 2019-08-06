const { path2 } = require('../../geometry')

const { expand } = require('../expansions')

const extrudeLinearGeom2 = require('./extrudeLinearGeom2')

/**
 * Expand and extrude the given geometry (path2).
 * @param {Object} options - options for extrusion, if any
 * @param {Number} [options.radius=1] - radius of the rectangle
 * @param {Integer} [options.segments=0] - number of segments for rounded ends, or zero for chamfer
 * @param {Array} [options.offset=[0,0,1]] - direction of the extrusion as a 3D vector
 * @param {Number} [options.twistAngle=0] - final rotation (RADIANS) about the origin of the shape (if any)
 * @param {Integer} [options.twistSteps=1] - number of twist segments about the axis (if any)
 * @param {path2} geometry - the geometry to extrude
 * @return {geom3} the extruded geometry
 */
const extrudeRectangularPath2 = (options, geometry) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let { radius, segments } = Object.assign({ }, defaults, options)

  options.delta = radius
  options.segments = segments

  const points = path2.toPoints(geometry)
  if (points.length === 0) throw new Error('the given geometry cannot be empty')

  let newgeometry = expand(options, geometry)
  return extrudeLinearGeom2(options, newgeometry)
}

module.exports = extrudeRectangularPath2
