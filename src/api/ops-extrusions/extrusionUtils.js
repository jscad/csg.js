const {EPS, defaultResolution3D} = require('../core/constants')
const OrthoNormalBasis = require('../core/math/OrthoNormalBasis')
const {parseOptionAs3DVector, parseOptionAsBool, parseOptionAsFloat, parseOptionAsInt} = require('./optionParsers')
const Vector3D = require('../core/math/Vector3')
const {Connector} = require('../core/connectors')
const {fromPolygons} = require('../core/CSGFactories')

const Vertex3D = require('../core/math/Vertex3')
const Vector2D = require('../core/math/Vector2')
const Polygon3 = require('../core/math/Polygon3')
/*
    * transform a cag into the polygons of a corresponding 3d plane, positioned per options
    * Accepts a connector for plane positioning, or optionally
    * single translation, axisVector, normalVector arguments
    * (toConnector has precedence over single arguments if provided)
    */
const _toPlanePolygons = function (_cag, options) {
  const defaults = {
    flipped: false
  }
  options = Object.assign({}, defaults, options)
  let {flipped} = options
    // reference connector for transformation
  let origin = [0, 0, 0]
  let defaultAxis = [0, 0, 1]
  let defaultNormal = [0, 1, 0]
  let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
    // translated connector per options
  let translation = options.translation || origin
  let axisVector = options.axisVector || defaultAxis
  let normalVector = options.normalVector || defaultNormal
    // will override above if options has toConnector
  let toConnector = options.toConnector ||
            new Connector(translation, axisVector, normalVector)
    // resulting transform
  let m = thisConnector.getTransformationTo(toConnector, false, 0)
    // create plane as a (partial non-closed) CSG in XY plane
  let bounds = _cag.getBounds()
  bounds[0] = bounds[0].minus(new Vector2D(1, 1))
  bounds[1] = bounds[1].plus(new Vector2D(1, 1))
  let csgshell = _cag._toCSGWall(-1, 1)
  let csgplane = fromPolygons([new Polygon3([
    new Vertex3D(new Vector3D(bounds[0].x, bounds[0].y, 0)),
    new Vertex3D(new Vector3D(bounds[1].x, bounds[0].y, 0)),
    new Vertex3D(new Vector3D(bounds[1].x, bounds[1].y, 0)),
    new Vertex3D(new Vector3D(bounds[0].x, bounds[1].y, 0))
  ])])
  if (flipped) {
    csgplane = csgplane.invert()
  }
    // intersectSub -> prevent premature retesselate/canonicalize
  csgplane = csgplane.intersectSub(csgshell)
    // only keep the polygons in the z plane:
  let polys = csgplane.polygons.filter(function (polygon) {
    return Math.abs(polygon.plane.normal.z) > 0.99
  })
    // finally, position the plane per passed transformations
  return polys.map(function (poly) {
    return poly.transform(m)
  })
}
const _toVector3DPairs = function (cag, m) {
    // transform m
  let pairs = cag.sides.map(function (side) {
    let p0 = side.vertex0.pos
    let p1 = side.vertex1.pos
    return [Vector3D.Create(p0.x, p0.y, 0),
      Vector3D.Create(p1.x, p1.y, 0)]
  })
  if (typeof m !== 'undefined') {
    pairs = pairs.map(function (pair) {
      return pair.map(function (v) {
        return v.transform(m)
      })
    })
  }
  return pairs
}

/*
* given 2 connectors, this returns all polygons of a "wall" between 2
* copies of this cag, positioned in 3d space as "bottom" and
* "top" plane per connectors toConnector1, and toConnector2, respectively
*/
const _toWallPolygons = function (_cag, options) {
  // normals are going to be correct as long as toConn2.point - toConn1.point
  // points into cag normal direction (check in caller)
  // arguments: options.toConnector1, options.toConnector2, options.cag
  //     walls go from toConnector1 to toConnector2
  //     optionally, target cag to point to - cag needs to have same number of sides as this!
  let origin = [0, 0, 0]
  let defaultAxis = [0, 0, 1]
  let defaultNormal = [0, 1, 0]
  let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
        // arguments:
  let toConnector1 = options.toConnector1
        // let toConnector2 = new Connector([0, 0, -30], defaultAxis, defaultNormal);
  let toConnector2 = options.toConnector2
  if (!(toConnector1 instanceof Connector && toConnector2 instanceof Connector)) {
    throw new Error('could not parse Connector arguments toConnector1 or toConnector2')
  }
  if (options.cag) {
    if (options.cag.sides.length !== this.sides.length) {
      throw new Error('target cag needs same sides count as start cag')
    }
  }
        // target cag is same as this unless specified
  let toCag = options.cag || _cag
  let m1 = thisConnector.getTransformationTo(toConnector1, false, 0)
  let m2 = thisConnector.getTransformationTo(toConnector2, false, 0)
  let vps1 = _toVector3DPairs(_cag, m1)
  let vps2 = _toVector3DPairs(toCag, m2)

  let polygons = []
  vps1.forEach(function (vp1, i) {
    polygons.push(new Polygon3([
      new Vertex3D(vps2[i][1]), new Vertex3D(vps2[i][0]), new Vertex3D(vp1[0])]))
    polygons.push(new Polygon3([
      new Vertex3D(vps2[i][1]), new Vertex3D(vp1[0]), new Vertex3D(vp1[1])]))
  })
  return polygons
}

/** extrude the CAG in a certain plane.
 * Giving just a plane is not enough, multiple different extrusions in the same plane would be possible
 * by rotating around the plane's origin. An additional right-hand vector should be specified as well,
 * and this is exactly a OrthoNormalBasis.
 * @param  {CAG} cag the cag to extrude
 * @param  {Orthonormalbasis} orthonormalbasis characterizes the plane in which to extrude
 * @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
 *  (unless symmetrical option is set, see below)
 * @param  {Object} [options] - options for construction
 * @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
 */
const extrudeInOrthonormalBasis = function (cag, orthonormalbasis, depth, options) {
      // first extrude in the regular Z plane:
  if (!(orthonormalbasis instanceof OrthoNormalBasis)) {
    throw new Error('extrudeInPlane: the first parameter should be a OrthoNormalBasis')
  }
  let extruded = extrude(cag, {
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
 * @param  {CAG} cag the cag to extrude
 * @param  {String} axis1 the first axis
 * @param  {String} axis2 the second axis
 * @param  {Float} depth thickness of the extruded shape. Extrusion is done upwards from the plane
 * @param  {Object} [options] - options for construction
 * @param {Boolean} [options.symmetrical=true] - extrude symmetrically in two directions about the plane
 */
const extrudeInPlane = function (cag, axis1, axis2, depth, options) {
  return extrudeInOrthonormalBasis(cag, OrthoNormalBasis.GetCartesian(axis1, axis2), depth, options)
}

/** linear extrusion of 2D shape, with optional twist
 * @param  {CAG} cag the cag to extrude
 * @param  {Object} [options] - options for construction
 * @param {Array} [options.offset=[0,0,1]] - The 2d shape is placed in in z=0 plane and extruded into direction <offset>
 * (a 3D vector as a 3 component array)
 * @param {Boolean} [options.twiststeps=defaultResolution3D] - twiststeps determines the resolution of the twist (should be >= 1)
 * @param {Boolean} [options.twistangle=0] - twistangle The final face is rotated <twistangle> degrees. Rotation is done around the origin of the 2d shape (i.e. x=0, y=0)
 * @returns {CSG} the extrude shape, as a CSG object
 * @example extruded=cag.extrude({offset: [0,0,10], twistangle: 360, twiststeps: 100});
*/
const extrude = function (cag, options) {
  const CSG = require('../core/CSG')
  if (cag.sides.length === 0) {
    // empty! : FIXME: should this throw ?
    return new CSG()
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
  let normalVector = Vector3D.Create(0, 1, 0)

  let polygons = []
  // bottom and top
  polygons = polygons.concat(_toPlanePolygons(cag, {
    translation: [0, 0, 0],
    normalVector: normalVector,
    flipped: !(offsetVector.z < 0)}
  ))
  polygons = polygons.concat(_toPlanePolygons(cag, {
    translation: offsetVector,
    normalVector: normalVector.rotateZ(twistangle),
    flipped: offsetVector.z < 0}))
  // walls
  for (let i = 0; i < twiststeps; i++) {
    let c1 = new Connector(offsetVector.times(i / twiststeps), [0, 0, offsetVector.z],
              normalVector.rotateZ(i * twistangle / twiststeps))
    let c2 = new Connector(offsetVector.times((i + 1) / twiststeps), [0, 0, offsetVector.z],
              normalVector.rotateZ((i + 1) * twistangle / twiststeps))
    polygons = polygons.concat(_toWallPolygons(cag, {toConnector1: c1, toConnector2: c2}))
  }

  return fromPolygons(polygons)
}

// THIS IS AN OLD untested !!! version of rotate extrude
/** Extrude to into a 3D solid by rotating the origin around the Y axis.
 * (and turning everything into XY plane)
 * @param {Object} options - options for construction
 * @param {Number} [options.angle=360] - angle of rotation
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 */
const rotateExtrude = function (cag, options) { // FIXME options should be optional
  let alpha = parseOptionAsFloat(options, 'angle', 360)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)

  alpha = alpha > 360 ? alpha % 360 : alpha
  let origin = [0, 0, 0]
  let axisV = Vector3D.Create(0, 1, 0)
  let normalV = [0, 0, 1]
  let polygons = []
  // planes only needed if alpha > 0
  let connS = new Connector(origin, axisV, normalV)
  if (alpha > 0 && alpha < 360) {
          // we need to rotate negative to satisfy wall function condition of
          // building in the direction of axis vector
    let connE = new Connector(origin, axisV.rotateZ(-alpha), normalV)
    polygons = polygons.concat(
              _toPlanePolygons(cag, {toConnector: connS, flipped: true}))
    polygons = polygons.concat(
              _toPlanePolygons(cag, {toConnector: connE}))
  }
  let connT1 = connS
  let connT2
  let step = alpha / resolution
  for (let a = step; a <= alpha + EPS; a += step) { // FIXME Should this be angelEPS?
    connT2 = new Connector(origin, axisV.rotateZ(-a), normalV)
    polygons = polygons.concat(_toWallPolygons(cag,
              {toConnector1: connT1, toConnector2: connT2}))
    connT1 = connT2
  }
  return fromPolygons(polygons).reTesselated()
}

// FIXME: right now linear & rotate extrude take params first, while rectangular_extrude
// takes params second ! confusing and incoherent ! needs to be changed (BREAKING CHANGE !)

module.exports = {
  extrudeInOrthonormalBasis,
  extrudeInPlane,
  extrude,
  rotateExtrude,
  _toPlanePolygons
}
