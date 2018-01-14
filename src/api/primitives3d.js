const {parseOption, parseOptionAs3DVector, parseOptionAs2DVector, parseOptionAs3DVectorList, parseOptionAsFloat, parseOptionAsInt} = require('./optionParsers')
const {defaultResolution3D, defaultResolution2D, EPS} = require('../core/constants')
const Vector3D = require('../core/math/Vector3')
const Vertex = require('../core/math/Vertex3')
const Polygon = require('../core/math/Polygon3')
const {Connector} = require('../core/connectors')
const Properties = require('../core/Properties')
const {fromPolygons} = require('../core/CSGFactories')

/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of cube, single scalar also possible
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.cube({
 *   center: [5, 5, 5],
 *   radius: 5, // scalar radius
 * });
 */
const cube = function (options) {
  let c
  let r
  let corner1
  let corner2
  options = options || {}
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('cube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
    c = corner1.plus(corner2).times(0.5)
    r = corner2.minus(corner1).times(0.5)
  } else {
    c = parseOptionAs3DVector(options, 'center', [0, 0, 0])
    r = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
  }
  r = r.abs() // negative radii make no sense
  let result = fromPolygons([
    [
            [0, 4, 6, 2],
            [-1, 0, 0]
    ],
    [
            [1, 3, 7, 5],
            [+1, 0, 0]
    ],
    [
            [0, 1, 5, 4],
            [0, -1, 0]
    ],
    [
            [2, 6, 7, 3],
            [0, +1, 0]
    ],
    [
            [0, 2, 3, 1],
            [0, 0, -1]
    ],
    [
            [4, 5, 7, 6],
            [0, 0, +1]
    ]
  ].map(function (info) {
    let vertices = info[0].map(function (i) {
      let pos = new Vector3D(
                c.x + r.x * (2 * !!(i & 1) - 1), c.y + r.y * (2 * !!(i & 2) - 1), c.z + r.z * (2 * !!(i & 4) - 1))
      return new Vertex(pos)
    })
    return new Polygon(vertices, null /* , plane */)
  }))
  result.properties.cube = new Properties()
  result.properties.cube.center = new Vector3D(c)
    // add 6 connectors, at the centers of each face:
  result.properties.cube.facecenters = [
    new Connector(new Vector3D([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3D([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0])
  ]
  return result
}

/** Construct a solid sphere
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of sphere
 * @param {Number} [options.radius=1] - radius of sphere
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @param {Array} [options.axes] -  an array with 3 vectors for the x, y and z base vectors
 * @returns {CSG} new 3D solid
 *
 *
 * @example
 * let sphere = CSG.sphere({
 *   center: [0, 0, 0],
 *   radius: 2,
 *   resolution: 32,
 * });
*/
const sphere = function (options) {
  options = options || {}
  let center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  let xvector, yvector, zvector
  if ('axes' in options) {
    xvector = options.axes[0].unit().times(radius)
    yvector = options.axes[1].unit().times(radius)
    zvector = options.axes[2].unit().times(radius)
  } else {
    xvector = new Vector3D([1, 0, 0]).times(radius)
    yvector = new Vector3D([0, -1, 0]).times(radius)
    zvector = new Vector3D([0, 0, 1]).times(radius)
  }
  if (resolution < 4) resolution = 4
  let qresolution = Math.round(resolution / 4)
  let prevcylinderpoint
  let polygons = []
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
    if (slice1 > 0) {
            // cylinder vertices:
      let vertices = []
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          vertices = []
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          polygons.push(new Polygon(vertices))
          vertices = []
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          vertices.reverse()
          polygons.push(new Polygon(vertices))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = fromPolygons(polygons)
  result.properties.sphere = new Properties()
  result.properties.sphere.center = new Vector3D(center)
  result.properties.sphere.facepoint = center.plus(xvector)
  return result
}

/** Construct a solid cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of cylinder, must be scalar
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.cylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 10,
 *   resolution: 16
 * });
 */
const cylinder = function (options) {
  let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let r = parseOptionAsFloat(options, 'radius', 1)
  let rEnd = parseOptionAsFloat(options, 'radiusEnd', r)
  let rStart = parseOptionAsFloat(options, 'radiusStart', r)
  let alpha = parseOptionAsFloat(options, 'sectorAngle', 360)
  alpha = alpha > 360 ? alpha % 360 : alpha

  if ((rEnd < 0) || (rStart < 0)) {
    throw new Error('Radius should be non-negative')
  }
  if ((rEnd === 0) && (rStart === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive')
  }

  let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this 3D?
  let ray = e.minus(s)
  let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
  let axisX = axisZ.randomNonParallelVector().unit()

    //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
  let axisY = axisX.cross(axisZ).unit()
  let start = new Vertex(s)
  let end = new Vertex(e)
  let polygons = []

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * alpha / 180
    let out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)))
    let pos = s.plus(ray.times(stack)).plus(out.times(radius))
    return new Vertex(pos)
  }
  if (alpha > 0) {
    for (let i = 0; i < slices; i++) {
      let t0 = i / slices
      let t1 = (i + 1) / slices
      if (rEnd === rStart) {
        polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
        polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
        polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
      } else {
        if (rStart > 0) {
          polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
          polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
        }
        if (rEnd > 0) {
          polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
          polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
        }
      }
    }
    if (alpha < 360) {
      polygons.push(new Polygon([start, end, point(0, 0, rStart)]))
      polygons.push(new Polygon([point(0, 0, rStart), end, point(1, 0, rEnd)]))
      polygons.push(new Polygon([start, point(0, 1, rStart), end]))
      polygons.push(new Polygon([point(0, 1, rStart), point(1, 1, rEnd), end]))
    }
  }
  let result = fromPolygons(polygons)
  result.properties.cylinder = new Properties()
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
  result.properties.cylinder.end = new Connector(e, axisZ, axisX)
  let cylCenter = s.plus(ray.times(0.5))
  let fptVec = axisX.rotate(s, axisZ, -alpha / 2).times((rStart + rEnd) / 2)
  let fptVec90 = fptVec.cross(axisZ)
    // note this one is NOT a face normal for a cone. - It's horizontal from cyl perspective
  result.properties.cylinder.facepointH = new Connector(cylCenter.plus(fptVec), fptVec, axisZ)
  result.properties.cylinder.facepointH90 = new Connector(cylCenter.plus(fptVec90), fptVec90, axisZ)
  return result
}

/** Construct a cylinder with rounded ends.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
 * @param {Vector3D} [options.normal] - vector determining the starting angle for tesselation. Should be non-parallel to start.minus(end)
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   resolution: 16
 * });
 */
const roundedCylinder = function (options) {
  let p1 = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let p2 = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let radius = parseOptionAsFloat(options, 'radius', 1)
  let direction = p2.minus(p1)
  let defaultnormal
  if (Math.abs(direction.x) > Math.abs(direction.y)) {
    defaultnormal = new Vector3D(0, 1, 0)
  } else {
    defaultnormal = new Vector3D(1, 0, 0)
  }
  let normal = parseOptionAs3DVector(options, 'normal', defaultnormal)
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  if (resolution < 4) resolution = 4
  let polygons = []
  let qresolution = Math.floor(0.25 * resolution)
  let length = direction.length()
  if (length < EPS) {
    return sphere({
      center: p1,
      radius: radius,
      resolution: resolution
    })
  }
  let zvector = direction.unit().times(radius)
  let xvector = zvector.cross(normal).unit().times(radius)
  let yvector = xvector.cross(zvector).unit().times(radius)
  let prevcylinderpoint
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)))
    if (slice1 > 0) {
            // cylinder vertices:
      let vertices = []
      vertices.push(new Vertex(p1.plus(cylinderpoint)))
      vertices.push(new Vertex(p1.plus(prevcylinderpoint)))
      vertices.push(new Vertex(p2.plus(prevcylinderpoint)))
      vertices.push(new Vertex(p2.plus(cylinderpoint)))
      polygons.push(new Polygon(vertices))
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
                // let pitch = Math.asin(slice2/qresolution);
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          vertices = []
          vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(p1.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(p1.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(p1.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))))
          polygons.push(new Polygon(vertices))
          vertices = []
          vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          vertices.push(new Vertex(p2.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))))
          if (slice2 < qresolution) {
            vertices.push(new Vertex(p2.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          }
          vertices.push(new Vertex(p2.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))))
          vertices.reverse()
          polygons.push(new Polygon(vertices))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = fromPolygons(polygons)
  let ray = zvector.unit()
  let axisX = xvector.unit()
  result.properties.roundedCylinder = new Properties()
  result.properties.roundedCylinder.start = new Connector(p1, ray.negated(), axisX)
  result.properties.roundedCylinder.end = new Connector(p2, ray, axisX)
  result.properties.roundedCylinder.facepoint = p1.plus(xvector)
  return result
}

/** Construct an elliptic cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded ends, must be two dimensional array
 * @param {Vector2D} [options.radiusStart=[1,1]] - OPTIONAL radius of rounded start, must be two dimensional array
 * @param {Vector2D} [options.radiusEnd=[1,1]] - OPTIONAL radius of rounded end, must be two dimensional array
 * @param {Number} [options.resolution=defaultResolution2D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 *     let cylinder = CSG.cylinderElliptic({
 *       start: [0, -10, 0],
 *       end: [0, 10, 0],
 *       radiusStart: [10,5],
 *       radiusEnd: [8,3],
 *       resolution: 16
 *     });
 */

const cylinderElliptic = function (options) {
  let s = parseOptionAs3DVector(options, 'start', [0, -1, 0])
  let e = parseOptionAs3DVector(options, 'end', [0, 1, 0])
  let r = parseOptionAs2DVector(options, 'radius', [1, 1])
  let rEnd = parseOptionAs2DVector(options, 'radiusEnd', r)
  let rStart = parseOptionAs2DVector(options, 'radiusStart', r)

  if ((rEnd._x < 0) || (rStart._x < 0) || (rEnd._y < 0) || (rStart._y < 0)) {
    throw new Error('Radius should be non-negative')
  }
  if ((rEnd._x === 0 || rEnd._y === 0) && (rStart._x === 0 || rStart._y === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive')
  }

  let slices = parseOptionAsInt(options, 'resolution', defaultResolution2D) // FIXME is this correct?
  let ray = e.minus(s)
  let axisZ = ray.unit() //, isY = (Math.abs(axisZ.y) > 0.5);
  let axisX = axisZ.randomNonParallelVector().unit()

    //  let axisX = new Vector3D(isY, !isY, 0).cross(axisZ).unit();
  let axisY = axisX.cross(axisZ).unit()
  let start = new Vertex(s)
  let end = new Vertex(e)
  let polygons = []

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * 2
    let out = axisX.times(radius._x * Math.cos(angle)).plus(axisY.times(radius._y * Math.sin(angle)))
    let pos = s.plus(ray.times(stack)).plus(out)
    return new Vertex(pos)
  }
  for (let i = 0; i < slices; i++) {
    let t0 = i / slices
    let t1 = (i + 1) / slices

    if (rEnd._x === rStart._x && rEnd._y === rStart._y) {
      polygons.push(new Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
      polygons.push(new Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
      polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
    } else {
      if (rStart._x > 0) {
        polygons.push(new Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]))
        polygons.push(new Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
      }
      if (rEnd._x > 0) {
        polygons.push(new Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
        polygons.push(new Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
      }
    }
  }
  let result = fromPolygons(polygons)
  result.properties.cylinder = new Properties()
  result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
  result.properties.cylinder.end = new Connector(e, axisZ, axisX)
  result.properties.cylinder.facepoint = s.plus(axisX.times(rStart))
  return result
}

/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   radius: 15,
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
const roundedCube = function (options) {
  let minRR = 1e-2 // minroundradius 1e-3 gives rounding errors already
  let center
  let cuberadius
  let corner1
  let corner2
  options = options || {}
  if (('corner1' in options) || ('corner2' in options)) {
    if (('center' in options) || ('radius' in options)) {
      throw new Error('roundedCube: should either give a radius and center parameter, or a corner1 and corner2 parameter')
    }
    corner1 = parseOptionAs3DVector(options, 'corner1', [0, 0, 0])
    corner2 = parseOptionAs3DVector(options, 'corner2', [1, 1, 1])
    center = corner1.plus(corner2).times(0.5)
    cuberadius = corner2.minus(corner1).times(0.5)
  } else {
    center = parseOptionAs3DVector(options, 'center', [0, 0, 0])
    cuberadius = parseOptionAs3DVector(options, 'radius', [1, 1, 1])
  }
  cuberadius = cuberadius.abs() // negative radii make no sense
  let resolution = parseOptionAsInt(options, 'resolution', defaultResolution3D)
  if (resolution < 4) resolution = 4
  if (resolution % 2 === 1 && resolution < 8) resolution = 8 // avoid ugly
  let roundradius = parseOptionAs3DVector(options, 'roundradius', [0.2, 0.2, 0.2])
    // slight hack for now - total radius stays ok
  roundradius = Vector3D.Create(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR))
  let innerradius = cuberadius.minus(roundradius)
  if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
    throw new Error('roundradius <= radius!')
  }
  let res = sphere({radius: 1, resolution: resolution})
  res = res.scale(roundradius)
  innerradius.x > EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2 * innerradius.x))
  innerradius.y > EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2 * innerradius.y))
  innerradius.z > EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2 * innerradius.z))
  res = res.translate([-innerradius.x + center.x, -innerradius.y + center.y, -innerradius.z + center.z])
  res = res.reTesselated()
  res.properties.roundedCube = new Properties()
  res.properties.roundedCube.center = new Vertex(center)
  res.properties.roundedCube.facecenters = [
    new Connector(new Vector3D([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]),
    new Connector(new Vector3D([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]),
    new Connector(new Vector3D([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0])
  ]
  return res
}

/** Create a polyhedron using Openscad style arguments.
 * Define face vertices clockwise looking from outside.
 * @param {Object} [options] - options for construction
 * @returns {CSG} new 3D solid
 */
const polyhedron = function (options) {
  options = options || {}
  if (('points' in options) !== ('faces' in options)) {
    throw new Error("polyhedron needs 'points' and 'faces' arrays")
  }
  let vertices = parseOptionAs3DVectorList(options, 'points', [
            [1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [-1, 1, 0],
            [0, 0, 1]
  ])
        .map(function (pt) {
          return new Vertex(pt)
        })
  let faces = parseOption(options, 'faces', [
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4],
            [1, 0, 3],
            [2, 1, 3]
  ])
    // Openscad convention defines inward normals - so we have to invert here
  faces.forEach(function (face) {
    face.reverse()
  })
  let polygons = faces.map(function (face) {
    return new Polygon(face.map(function (idx) {
      return vertices[idx]
    }))
  })

    // TODO: facecenters as connectors? probably overkill. Maybe centroid
    // the re-tesselation here happens because it's so easy for a user to
    // create parametrized polyhedrons that end up with 1-2 dimensional polygons.
    // These will create infinite loops at CSG.Tree()
  return fromPolygons(polygons).reTesselated()
}

/// //////////FUNCTIONAL API
const { CSG } = require('@jscad/csg')
const { circle } = require('./primitives2d')
const { rotate_extrude } = require('./ops-extrusions')
const { translate, scale } = require('./ops-transformations')
/** Construct a cuboid
 * @param {Object} [options] - options for construction
 * @param {Float} [options.size=1] - size of the side of the cuboid : can be either:
 * - a scalar : ie a single float, in which case all dimensions will be the same
 * - or an array: to specify different dimensions along x/y/z
 * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
 * @returns {CSG} new sphere
 *
 * @example
 * let cubeFn1 = cubeFn({
 *   r: 10,
 *   fn: 20
 * })
 */
function cubeFn (params) {
  const defaults = {
    size: 1,
    offset: [0, 0, 0],
    round: false,
    radius: 0,
    fn: 8
  }

  let {round, radius, fn, size} = Object.assign({}, defaults, params)
  let offset = [0, 0, 0]
  let v = null
  if (params && params.length) v = params
  if (params && params.size && params.size.length) v = params.size // { size: [1,2,3] }
  if (params && params.size && !params.size.length) size = params.size // { size: 1 }
  if (params && (typeof params !== 'object')) size = params// (2)
  if (params && params.round === true) {
    round = true
    radius = v && v.length ? (v[0] + v[1] + v[2]) / 30 : size / 10
  }
  if (params && params.radius) {
    round = true
    radius = params.radius
  }

  let x = size
  let y = size
  let z = size
  if (v && v.length) {
    [x, y, z] = v
  }
  offset = [x / 2, y / 2, z / 2] // center: false default
  let object = round
    ? CSG.roundedCube({radius: [x / 2, y / 2, z / 2], roundradius: radius, resolution: fn})
    : CSG.cube({radius: [x / 2, y / 2, z / 2]})
  if (params && params.center && params.center.length) {
    offset = [params.center[0] ? 0 : x / 2, params.center[1] ? 0 : y / 2, params.center[2] ? 0 : z / 2]
  } else if (params && params.center === true) {
    offset = [0, 0, 0]
  } else if (params && params.center === false) {
    offset = [x / 2, y / 2, z / 2]
  }
  return (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object
}

/** Construct a sphere
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the sphere
 * @param {Integer} [options.fn=32] - segments of the sphere (ie quality/resolution)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {String} [options.type='normal'] - type of sphere : either 'normal' or 'geodesic'
 * @returns {CSG} new sphere
 *
 * @example
 * let sphere1 = sphere({
 *   r: 10,
 *   fn: 20
 * })
 */
function sphereFn (params) {
  const defaults = {
    r: 1,
    fn: 32,
    type: 'normal'
  }

  let {r, fn, type} = Object.assign({}, defaults, params)
  let offset = [0, 0, 0] // center: false (default)
  if (params && (typeof params !== 'object')) {
    r = params
  } 
  // let zoffset = 0 // sphere() in openscad has no center:true|false

  let output = type === 'geodesic' ? geodesicSphere(params) : CSG.sphere({radius: r, resolution: fn})

  // preparing individual x,y,z center
  if (params && params.center && params.center.length) {
    offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? 0 : r]
  } else if (params && params.center === true) {
    offset = [0, 0, 0]
  } else if (params && params.center === false) {
    offset = [r, r, r]
  }
  return (offset[0] || offset[1] || offset[2]) ? translate(offset, output) : output 
}

function geodesicSphere (params) {
  const defaults = {
    r: 1,
    fn: 5
  }
  let {r, fn} = Object.assign({}, defaults, params)

  let ci = [ // hard-coded data of icosahedron (20 faces, all triangles)
    [0.850651, 0.000000, -0.525731],
    [0.850651, -0.000000, 0.525731],
    [-0.850651, -0.000000, 0.525731],
    [-0.850651, 0.000000, -0.525731],
    [0.000000, -0.525731, 0.850651],
    [0.000000, 0.525731, 0.850651],
    [0.000000, 0.525731, -0.850651],
    [0.000000, -0.525731, -0.850651],
    [-0.525731, -0.850651, -0.000000],
    [0.525731, -0.850651, -0.000000],
    [0.525731, 0.850651, 0.000000],
    [-0.525731, 0.850651, 0.000000]]

  let ti = [ [0, 9, 1], [1, 10, 0], [6, 7, 0], [10, 6, 0], [7, 9, 0], [5, 1, 4], [4, 1, 9], [5, 10, 1], [2, 8, 3], [3, 11, 2], [2, 5, 4],
    [4, 8, 2], [2, 11, 5], [3, 7, 6], [6, 11, 3], [8, 7, 3], [9, 8, 4], [11, 10, 5], [10, 11, 6], [8, 9, 7]]

  let geodesicSubDivide = function (p, fn, offset) {
    let p1 = p[0]
    let p2 = p[1]
    let p3 = p[2]
    let n = offset
    let c = []
    let f = []

    //           p3
    //           /\
    //          /__\     fn = 3
    //      i  /\  /\
    //        /__\/__\       total triangles = 9 (fn*fn)
    //       /\  /\  /\
    //     0/__\/__\/__\
    //    p1 0   j      p2

    for (let i = 0; i < fn; i++) {
      for (let j = 0; j < fn - i; j++) {
        let t0 = i / fn
        let t1 = (i + 1) / fn
        let s0 = j / (fn - i)
        let s1 = (j + 1) / (fn - i)
        let s2 = fn - i - 1 ? j / (fn - i - 1) : 1
        let q = []

        q[0] = mix3(mix3(p1, p2, s0), p3, t0)
        q[1] = mix3(mix3(p1, p2, s1), p3, t0)
        q[2] = mix3(mix3(p1, p2, s2), p3, t1)

        // -- normalize
        for (let k = 0; k < 3; k++) {
          let r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
          for (let l = 0; l < 3; l++) {
            q[k][l] /= r
          }
        }
        c.push(q[0], q[1], q[2])
        f.push([n, n + 1, n + 2]); n += 3

        if (j < fn - i - 1) {
          let s3 = fn - i - 1 ? (j + 1) / (fn - i - 1) : 1
          q[0] = mix3(mix3(p1, p2, s1), p3, t0)
          q[1] = mix3(mix3(p1, p2, s3), p3, t1)
          q[2] = mix3(mix3(p1, p2, s2), p3, t1)

          // -- normalize
          for (let k = 0; k < 3; k++) {
            let r = Math.sqrt(q[k][0] * q[k][0] + q[k][1] * q[k][1] + q[k][2] * q[k][2])
            for (let l = 0; l < 3; l++) {
              q[k][l] /= r
            }
          }
          c.push(q[0], q[1], q[2])
          f.push([n, n + 1, n + 2]); n += 3
        }
      }
    }
    return { points: c, triangles: f, offset: n }
  }

  const mix3 = function (a, b, f) {
    let _f = 1 - f
    let c = []
    for (let i = 0; i < 3; i++) {
      c[i] = a[i] * _f + b[i] * f
    }
    return c
  }

  if (params) {
    if (params.fn) fn = Math.floor(params.fn / 6)
  }

  if (fn <= 0) fn = 1

  let c = []
  let f = []
  let offset = 0

  for (let i = 0; i < ti.length; i++) {
    let g = geodesicSubDivide([ ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], fn, offset)
    c = c.concat(g.points)
    f = f.concat(g.triangles)
    offset = g.offset
  }
  return scale(r, polyhedron({points: c, triangles: f}))
}

/** Construct a cylinder
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the cylinder
 * @param {Float} [options.r1=1] - radius of the top of the cylinder
 * @param {Float} [options.r2=1] - radius of the bottom of the cylinder
 * @param {Float} [options.d=1] - diameter of the cylinder
 * @param {Float} [options.d1=1] - diameter of the top of the cylinder
 * @param {Float} [options.d2=1] - diameter of the bottom of the cylinder
 * @param {Integer} [options.fn=32] - number of sides of the cylinder (ie quality/resolution)
 * @returns {CSG} new cylinder
 *
 * @example
 * let cylinder = cylinder({
 *   d: 10,
 *   fn: 20
 * })
 */
function cylinderFn (params) {
  const defaults = {
    r: 1,
    r1: 1,
    r2: 1,
    h: 1,
    fn: 32,
    round: false
  }
  let {r1, r2, h, fn, round} = Object.assign({}, defaults, params)
  let offset = [0, 0, 0]
  let a = arguments
  if (params && params.d) {
    r1 = r2 = params.d / 2
  }
  if (params && params.r) {
    r1 = params.r
    r2 = params.r
  }
  if (params && params.h) {
    h = params.h
  }
  if (params && (params.r1 || params.r2)) {
    r1 = params.r1
    r2 = params.r2
    if (params.h) h = params.h
  }
  if (params && (params.d1 || params.d2)) {
    r1 = params.d1 / 2
    r2 = params.d2 / 2
  }

  if (a && a[0] && a[0].length) {
    a = a[0]
    r1 = a[0]
    r2 = a[1]
    h = a[2]
    if (a.length === 4) fn = a[3]
  }

  let object
  if (params && (params.start && params.end)) {
    object = round
      ? CSG.roundedCylinder({start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn})
      : CSG.cylinder({start: params.start, end: params.end, radiusStart: r1, radiusEnd: r2, resolution: fn})
  } else {
    object = round
      ? CSG.roundedCylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn})
      : CSG.cylinder({start: [0, 0, 0], end: [0, 0, h], radiusStart: r1, radiusEnd: r2, resolution: fn})
    let r = r1 > r2 ? r1 : r2
    if (params && params.center && params.center.length) { // preparing individual x,y,z center
      offset = [params.center[0] ? 0 : r, params.center[1] ? 0 : r, params.center[2] ? -h / 2 : 0]
    } else if (params && params.center === true) {
      offset = [0, 0, -h / 2]
    } else if (params && params.center === false) {
      offset = [0, 0, 0]
    }
    object = (offset[0] || offset[1] || offset[2]) ? translate(offset, object) : object
  }
  return object
}

/** Construct a torus
 * @param {Object} [options] - options for construction
 * @param {Float} [options.ri=1] - radius of base circle
 * @param {Float} [options.ro=4] - radius offset
 * @param {Integer} [options.fni=16] - segments of base circle (ie quality)
 * @param {Integer} [options.fno=32] - segments of extrusion (ie quality)
 * @param {Integer} [options.roti=0] - rotation angle of base circle
 * @returns {CSG} new torus
 *
 * @example
 * let torus1 = torus({
 *   ri: 10
 * })
 */
function torus (params) {
  const defaults = {
    ri: 1,
    ro: 4,
    fni: 16,
    fno: 32,
    roti: 0
  }
  params = Object.assign({}, defaults, params)

  /* possible enhancements ? declarative limits
  const limits = {
    fni: {min: 3},
    fno: {min: 3}
  }*/

  let {ri, ro, fni, fno, roti} = params

  if (fni < 3) fni = 3
  if (fno < 3) fno = 3

  let baseCircle = circle({r: ri, fn: fni, center: true})

  if (roti) baseCircle = baseCircle.rotateZ(roti)
  let result = rotate_extrude({fn: fno}, translate([ro, 0, 0], baseCircle))
  // result = result.union(result)
  return result
}

/** Construct a polyhedron from the given triangles/ polygons/points
 * @param {Object} [options] - options for construction
 * @param {Array} [options.triangles] - triangles to build the polyhedron from
 * @param {Array} [options.polygons] - polygons to build the polyhedron from
 * @param {Array} [options.points] - points to build the polyhedron from
 * @param {Array} [options.colors] - colors to apply to the polyhedron
 * @returns {CSG} new polyhedron
 *
 * @example
 * let torus1 = polyhedron({
 *   points: [...]
 * })
 */
function polyhedronFn (params) {
  let pgs = []
  let ref = params.triangles || params.polygons
  let colors = params.colors || null

  for (let i = 0; i < ref.length; i++) {
    let pp = []
    for (let j = 0; j < ref[i].length; j++) {
      pp[j] = params.points[ref[i][j]]
    }

    let v = []
    for (let j = ref[i].length - 1; j >= 0; j--) { // --- we reverse order for examples of OpenSCAD work
      v.push(new CSG.Vertex(new CSG.Vector3D(pp[j][0], pp[j][1], pp[j][2])))
    }
    let s = CSG.Polygon.defaultShared
    if (colors && colors[i]) {
      s = CSG.Polygon.Shared.fromColor(colors[i])
    }
    pgs.push(new CSG.Polygon(v, s))
  }

  return CSG.fromPolygons(pgs)
}


module.exports = {
  cube,
  sphere,
  roundedCube,
  cylinder,
  roundedCylinder,
  cylinderElliptic,
  polyhedron,
  //
  cubeFn,
  sphereFn,
  geodesicSphere,
  cylinderFn,
  torus,
  polyhedronFn
}
