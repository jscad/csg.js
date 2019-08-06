const flatten = require('../../utils/flatten')

const { geom2, path2 } = require('../../geometry')

const extrudeRectangularPath2 = require('./extrudeRectangularPath2')
const extrudeRectangularGeom2 = require('./extrudeRectangularGeom2')

/**
 * Extrude the given object(s) by following the outline(s) with a rectangle.
 * @param {Object} options - options for extrusion, if any
 * @param {Number} [options.radius=1] - radius of the rectangle
 * @param {Integer} [options.segments=0] - number of segments for rounded ends, or zero for chamfer
 * @param {Array} [options.offset=[0,0,1]] - direction of the extrusion as a 3D vector
 * @param {Number} [options.twistAngle=0] - final rotation (RADIANS) about the origin of the shape (if any)
 * @param {Integer} [options.twistSteps=1] - number of twist segments about the axis (if any)
 * @param {Object|Array} objects - the objects(s) to extrude
 * @return {Object|Array} the extruded object(s)
 *
 * @example:
 * let mywalls = extrudeRectangular({offset: [0,0,10]}, square())
 */
const extrudeRectangular = (options, ...objects) => {
  const defaults = {
    radius: 1,
    segments: 0
  }
  let { radius, segments } = Object.assign({}, defaults, options)

  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  if (radius <= 0) throw new Error('radius must be positive')
  if (segments < 0) throw new Error('segments must be zero or more')

  const results = objects.map((object) => {
    if (path2.isA(object)) return extrudeRectangularPath2(options, object)
    if (geom2.isA(object)) return extrudeRectangularGeom2(options, object)
    // if (geom3.isA(object)) return geom3.transform(matrix, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = extrudeRectangular
