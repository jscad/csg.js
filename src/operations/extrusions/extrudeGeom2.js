const {mat4, vec3} = require('../../math')

const {geom2} = require('../../geometry')

const slice = require('./slice')

const extrudeFromSlices = require('./extrudeFromSlices')

/**
 * Extrude the given geometry using the given options.
 *
 * @param {Object} [options] - options for extrude
 * @param {Array} [options.offset] - the direction of the extrusion as a 3D vector
 * @param {Number} [options.twistangle] - the final rotation (radians) about the origin of the shape
 * @param {Integer} [options.twiststeps] - the resolution of the twist (if any) about the axis
 * @param {geom2} geometry - the geometry to extrude
 * @returns {geom3} the extruded 3D geometry
*/
const extrudeGeom2 = (options, geometry) => {
  const defaults = {
    offset: [0, 0, 1],
    twistangle: 0,
    twiststeps: 12
  }
  let {offset, twistangle, twiststeps} = Object.assign({}, defaults, options)

  if (twiststeps < 1) throw new Error('twiststeps must be 1 or more')

  if (twistangle === 0) {
    twiststeps = 1
  }

  // convert to vector in order to perform transforms
  let offsetv = vec3.fromArray(offset)

  const baseSides = geom2.toSides(geometry)
  if (baseSides.length === 0) throw new Error('the given geometry cannot be empty')

  const baseSlice = slice.fromSides(baseSides)
  if (offsetv[2] < 0) slice.reverse(baseSlice, baseSlice)

  function createTwist(t, index) {
    let Zrotation = index / twiststeps * twistangle
    let Zoffset = vec3.scale(index / twiststeps, offsetv)
    let matrix = mat4.multiply(mat4.fromZRotation(Zrotation), mat4.fromTranslation(Zoffset))

    return slice.transform(matrix, this)
  }

  options = {
     numslices : twiststeps + 1,
     isCapped : true,
     callback : createTwist
  }
  return extrudeFromSlices(options, baseSlice)
}

module.exports = extrudeGeom2
