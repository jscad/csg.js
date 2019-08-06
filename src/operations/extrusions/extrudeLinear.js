const flatten = require('../../utils/flatten')

const { geom2 } = require('../../geometry')

const extrudeLinearGeom2 = require('./extrudeLinearGeom2')

/**
 * Extrude the given object(s) in a linear direction using the given options.
 * @param {Object} [options] - options for extrude
 * @param {Array} [options.offset=[0,0,1]] the direction of the extrusion as a 3D vector
 * @param {Number} [options.twistAngle=0] the final rotation (radians) about the origin of the shape (if any)
 * @param {Integer} [options.twistSteps=1] the resolution of the twist about the axis (if any)
 * @param {Object|Array} objects - the objects(s) to extrude
 * @return {Object|Array} the extruded object(s)
 *
 * @example
 * let myshape = extrudeLinear({offset: [0,0,10]}, rectangle({radius: [20, 25]}))
 */
const extrudeLinear = (options, ...objects) => {
  const defaults = {
    offset: [0, 0, 1],
    twistAngle: 0,
    twistSteps: 1
  }
  let { offset, twistAngle, twistSteps } = Object.assign({ }, defaults, options)

  if ((!Array.isArray(offset)) || offset.length < 3) throw new Error('offset must be a array of three values')
  if (offset[2] === 0) throw new Error('offset must define a direction above or below the Z axis')

  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  options = { offset: offset, twistAngle: twistAngle, twistSteps: twistSteps }

  const results = objects.map((object) => {
    // if (path.isA(object)) return pathextrude(options, object)
    if (geom2.isA(object)) return extrudeLinearGeom2(options, object)
    // if (geom3.isA(object)) return geom3.extrude(options, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = extrudeLinear
