const { EPS, defaultResolution3D } = require('../../constants')
const OrthoNormalBasis = require('../../math/OrthoNormalBasis')

const { parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt } = require('../../../api/optionParsers')
const { Connector } = require('../../connectors')
const fromPolygons = require('../geom3/fromPolygons')

const vec3 = require('../../math/vec3')
const poly3 = require('../poly3')
const shape2 = require('../../shape2')

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
const extrude = function (geometry, options) {
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
  polygons = polygons.concat(shape2.toPlanePolygons(geometry, {
    translation: [0, 0, 0],
    normalVector: normalVector,
    flipped: !(offsetVector.z < 0) }
  ))
  polygons = polygons.concat(shape2.toPlanePolygons(geometry, {
    translation: offsetVector,
    normalVector: normalVector.rotateZ(twistangle),
    flipped: offsetVector.z < 0 }))
  // walls
  for (let i = 0; i < twiststeps; i++) {
    let c1 = new Connector(offsetVector.times(i / twiststeps), [0, 0, offsetVector.z],
      normalVector.rotateZ(i * twistangle / twiststeps))
    let c2 = new Connector(offsetVector.times((i + 1) / twiststeps), [0, 0, offsetVector.z],
      normalVector.rotateZ((i + 1) * twistangle / twiststeps))
    polygons = polygons.concat(shape2.toWallPolygons(geometry, { toConnector1: c1, toConnector2: c2 }))
  }

  return fromPolygons(polygons)
}
/** extrude the Geom2 in a certain plane.
 * Giving just a plane is not enough, multiple different extrusions in the same plane would be possible
 * by rotating around the plane's origin. An additional right-hand vector should be specified as well,
 * and this is exactly a OrthoNormalBasis.
 * @param  {Geom2} geometry the geometry to extrude
 * @param  {Orthonormalbasis} orthonormalbasis characterizes the plane in which to extrude
 * @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
 *  (unless symmetrical option is set, see below)
 * @param  {Object} [options] - options for construction
 * @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
 */
const extrudeInOrthonormalBasis = function (geometry, orthonormalbasis, depth, options) {
  // first extrude in the regular Z plane:
  if (!(orthonormalbasis instanceof OrthoNormalBasis)) {
    throw new Error('extrudeInPlane: the first parameter should be a OrthoNormalBasis')
  }
  let extruded = extrude(geometry, {
    offset: [0, 0, depth]
  })
  if (parseOptionAsBool(options, 'symmetrical', false)) {
    extruded = extruded.translate([0, 0, -depth / 2])
  }
  let matrix = orthonormalbasis.getInverseProjectionMatrix()
  extruded = extruded.transform(matrix)
  return extruded
}

/** Extrude in a standard cartesian plane, specified by two axis identifiers. Each identifier can be
* one of ["X","Y","Z","-X","-Y","-Z"]
* The 2d x axis will map to the first given 3D axis, the 2d y axis will map to the second.
* See OrthoNormalBasis.GetCartesian for details.
* @param  {Geom2} geometry the geometry to extrude
* @param  {String} axis1 the first axis
* @param  {String} axis2 the second axis
* @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
* @param  {Object} [options] - options for construction
* @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
*/
const extrudeInPlane = function (geometry, axis1, axis2, depth, options) {
  return extrudeInOrthonormalBasis(geometry, OrthoNormalBasis.GetCartesian(axis1, axis2), depth, options)
}

// Extrude a polygon into the direction offsetvector
// Returns a Geom3 object
const extrudePolygon3 = function (offsetvector) {
  let newpolygons = []

  let polygon1 = this
  let direction = polygon1.plane.normal.dot(offsetvector)
  if (direction > 0) {
    polygon1 = polygon1.flipped()
  }
  newpolygons.push(polygon1)
  let polygon2 = polygon1.translate(offsetvector)
  let numvertices = this.vertices.length
  for (let i = 0; i < numvertices; i++) {
    let sidefacepoints = []
    let nexti = (i < (numvertices - 1)) ? i + 1 : 0
    sidefacepoints.push(polygon1.vertices[i].pos)
    sidefacepoints.push(polygon2.vertices[i].pos)
    sidefacepoints.push(polygon2.vertices[nexti].pos)
    sidefacepoints.push(polygon1.vertices[nexti].pos)
    let sidefacepolygon = poly3.fromPoints(sidefacepoints, this.shared)
    newpolygons.push(sidefacepolygon)
  }
  polygon2 = polygon2.flipped()
  newpolygons.push(polygon2)
  return fromPolygons(newpolygons)
}

// FIXME: right now linear & rotate extrude take params first, while rectangular_extrude
// takes params second ! confusing and incoherent ! needs to be changed (BREAKING CHANGE !)

module.exports = {
  extrudeInOrthonormalBasis,
  extrudeInPlane,
  extrude,
  extrudePolygon3
}
