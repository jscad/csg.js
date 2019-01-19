const { parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt } = require('../../../api/optionParsers')

const vec3 = require('../../math/vec3')
const toPlanePolygons = require('./toPlanePolygons')
const toWallPolygons = require('./toWallPolygons')
const fromPolygons = require('../geom3/fromPolygons')

const connector = require('../../connector')

/** linear extrusion of 2D shape, with optional twist
 * @param  {Geom2} geometry the geometry to extrude
 * @param  {Object} [options] - options for construction
 * @param {Array} [options.offset=[0,0,1]] - The 2d shape is placed in in z=0 plane and extruded into direction <offset>
 * (a 3D vector as a 3 component array)
 * @param {Boolean} [options.twiststeps=defaultResolution3D] - twiststeps determines the resolution of the twist (should be >= 1)
 * @param {Boolean} [options.twistangle=0] - twistangle The final face is rotated <twistangle> degrees. Rotation is done around the origin of the 2d shape (i.e. x=0, y=0)
 * @returns {Geom3} the extrude shape, as a Geom3 object
 * @example extruded=geometry.extrude({offset: [0,0,10], twistangle: 360, twiststeps: 100});
*/
const extrude = (geometry, options) => {
  if (geometry.sides.length === 0) {
    throw new Error('cannot extrude a 2D shape with no edges !!')
  }
  let offsetVector = parseOptionAs3DVector(options, 'offset', [0, 0, 1])
  let twistangle = parseOptionAsFloat(options, 'twistangle', 0)
  let twiststeps = parseOptionAsInt(options, 'twiststeps', defaultResolution3D)
  if (offsetVector.z === 0) {
    throw new Error('offset cannot be orthogonal to Z axis')
  }
  if (twistangle === 0 || twiststeps < 1) {
    twiststeps = 1
  }
  let normalVector = vec3.fromValues(0, 1, 0)
  let polygons = []
  // bottom and top
  polygons = polygons.concat(toPlanePolygons(geometry, {
    translation: [0, 0, 0],
    normalVector: normalVector,
    flipped: !(offsetVector.z < 0) }
  ))
  polygons = polygons.concat(toPlanePolygons(geometry, {
    translation: offsetVector,
    normalVector: normalVector.rotateZ(twistangle),
    flipped: offsetVector.z < 0 }))
  // walls
  for (let i = 0; i < twiststeps; i++) {
    let c1 = connector.fromPointAxisNormal(
      vec3.scale(i / twiststeps, offsetVector),
      [0, 0, offsetVector[2]],
      vec3.rotateZ(i * twistangle / twiststeps, normalVector)
    )
    let c2 = connector.fromPointAxisNormal(
      vec3.scale((i + 1) / twiststeps, offsetVector),
      [0, 0, offsetVector.z],
      vec3.rotateZ((i + 1) * twistangle / twiststeps, normalVector)
    )
    polygons = polygons.concat(toWallPolygons(geometry, { toConnector1: c1, toConnector2: c2 }))
  }

  return fromPolygons(polygons)
}

module.exports = extrude
