const { area } = require('../../math/utils')

const { geom2, path2 } = require('../../geometry')

const { expand } = require('../expansions')

const extrudeLinearGeom2 = require('./extrudeLinearGeom2')

/**
 * Expand and extrude the given geometry (geom2).
 * @param {Object} options - options for extrusion, if any
 * @param {Number} [options.radius=1] - radius of the rectangle
 * @param {Integer} [options.segments=0] - number of segments for rounded ends, or zero for chamfer
 * @param {Array} [options.offset=[0,0,1]] - direction of the extrusion as a 3D vector
 * @param {Number} [options.twistAngle=0] - final rotation (RADIANS) about the origin of the shape (if any)
 * @param {Integer} [options.twistSteps=1] - number of twist segments about the axis (if any)
 * @param {geom2} geometry - the geometry to extrude
 * @return {geom3} the extruded geometry
 */
const extrudeRectangularGeom2 = (options, geometry) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let { radius, segments } = Object.assign({ }, defaults, options)

  options.delta = radius
  options.segments = segments

  // convert the geometry to outlines
  let outlines = geom2.toOutlines(geometry)
  if (outlines.length === 0) throw new Error('the given geometry cannot be empty')

  // expand the outlines
  let newparts = outlines.map((outline) => {
    if (area(outline) < 0) outline.reverse() // all outlines must wind counter clockwise
    return expand(options, path2.fromPoints({ closed: true }, outline))
  })

  // create a composite geometry
  let allsides = newparts.reduce((sides, part) => sides.concat(geom2.toSides(part)), [])
  let newgeometry = geom2.create(allsides)

  return extrudeLinearGeom2(options, newgeometry)
}

module.exports = extrudeRectangularGeom2
