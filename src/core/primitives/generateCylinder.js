const vec3 = require('../math/vec3')

const poly3 = require('../geometry/poly3')
const shape3 = require('../shape3')

/** Construct an elliptic cylinder.
 * @param {Object} options - options for construction
 * @param {vec3} options.start=[0,-1,0]] - start point of cylinder
 * @param {vec3} options.end=[0,1,0]] - end point of cylinder
 * @param {vec2} options.radiusStart - radius of rounded start, must be two dimensional array
 * @param {vec2} options.radiusEnd - radius of rounded end, must be two dimensional array
 * @param {Number} options.resolution - number of polygons per 360 degree revolution
 * @returns {shape3} a new 3D shape with transform and geometry
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

const generateCylinder = function (options) {
  let s = options.start
  let e = options.end
  let rStart = options.radiusStart
  let rEnd = options.radiusEnd
  let slices = options.segments

  if ((rEnd[0] < 0) || (rStart[0] < 0) || (rEnd[1] < 0) || (rStart[1] < 0)) {
    throw new Error('Radius should be non-negative')
  }
  if ((rEnd[0] === 0 || rEnd[1] === 0) && (rStart[0] === 0 || rStart[1] === 0)) {
    throw new Error('Either radiusStart or radiusEnd should be positive')
  }

  let ray = vec3.subtract(e, s)
  let axisZ = vec3.unit(ray)
  let axisX = vec3.unit(vec3.random(axisZ))
  let axisY = vec3.unit(vec3.cross(axisX, axisZ))
  let start = vec3.clone(s)
  let end = vec3.clone(e)

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * 2
    let x = vec3.scale((radius[0] * Math.cos(angle)), axisX)
    let y = vec3.scale((radius[1] * Math.sin(angle)), axisY)
    let out = vec3.add(x, y)
    let z = vec3.scale(stack, ray)
    let pos = vec3.add(vec3.add(s, z), out)
    //let pos = s.plus(ray.times(stack)).plus(out)
    return pos
  }

  let polygons = []
  for (let i = 0; i < slices; i++) {
    let t0 = i / slices
    let t1 = (i + 1) / slices

    if (rEnd[0] === rStart[0] && rEnd[1] === rStart[1]) {
      polygons.push(poly3.fromPoints([start, point(0, t0, rEnd), point(0, t1, rEnd)]))
      polygons.push(poly3.fromPoints([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]))
      polygons.push(poly3.fromPoints([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
    } else {
      if (rStart[0] > 0) {
        polygons.push(poly3.fromPoints([start, point(0, t0, rStart), point(0, t1, rStart)]))
        polygons.push(poly3.fromPoints([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]))
      }
      if (rEnd[0] > 0) {
        polygons.push(poly3.fromPoints([end, point(1, t1, rEnd), point(1, t0, rEnd)]))
        polygons.push(poly3.fromPoints([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]))
      }
    }
  }
  let result = shape3.fromPolygons(polygons)

  // FIXME add properties
  //result.properties.cylinder = new Properties()
  //result.properties.cylinder.start = new Connector(s, axisZ.negated(), axisX)
  //result.properties.cylinder.end = new Connector(e, axisZ, axisX)
  //result.properties.cylinder.facepoint = s.plus(axisX.times(rStart))

  return result
}

module.exports = generateCylinder
