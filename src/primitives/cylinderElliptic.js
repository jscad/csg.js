const {defaultResolution3D} = require('../core/constants')

const vec3 = require('../math/vec3')

const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/** Construct an elliptic cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector3} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector2D} [options.startRadius=[1,1]] - radius of rounded start, must be two dimensional array
 * @param {Vector3} [options.end=[0,1,0]] - end point of cylinder
 * @param {Vector2D} [options.endRadius=[1,1]] - radius of rounded end, must be two dimensional array
 * @param {Number} [options.segments=defaultResolution3D] - number of segments to create per 360 rotation
 * @returns {geom3} new geometry
 *
 * @example
 *     let cylinder = cylinderElliptic({
 *       start: [0, -10, 0],
 *       startRadius: [10,5],
 *       end: [0, 10, 0],
 *       endRadius: [8,3]
 *     });
 */
const cylinderElliptic = function (options) {
  const defaults = {
    start: [0, -1, 0],
    startRadius: [1,1],
    end: [0, 1, 0],
    endRadius: [1,1],
    segments: defaultResolution3D
  }
  let {start, startRadius, end, endRadius, segments} = Object.assign({}, defaults, options)

  if ((endRadius[0] <= 0) || (startRadius[0] <= 0) || (endRadius[1] <= 0) || (startRadius[1] <= 0)) {
    throw new Error('endRadus and startRadius should be positive')
  }

  if (segments < 4) throw new Error('segments must be four or more')

  let slices = segments

  let startv = vec3.fromArray(start)
  let endv = vec3.fromArray(end)
  let ray = vec3.subtract(end, start)

  let axisZ = vec3.unit(ray)
  let axisX = vec3.unit(vec3.random(axisZ))
  let axisY = vec3.unit(vec3.cross(axisX, axisZ))

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * 2
    let out = vec3.add(vec3.scale(radius[0] * Math.cos(angle), axisX), vec3.scale(radius[1] * Math.sin(angle), axisY))
    let pos = vec3.add(vec3.add(vec3.scale(stack, ray), startv), out)
    return pos
  }

  let polygons = []
  for (let i = 0; i < slices; i++) {
    let t0 = i / slices
    let t1 = (i + 1) / slices

    if (endRadius[0] === startRadius[0] && endRadius[1] === startRadius[1]) {
      polygons.push(poly3.fromPoints([start, point(0, t0, endRadius), point(0, t1, endRadius)]))
      polygons.push(poly3.fromPoints([point(0, t1, endRadius), point(0, t0, endRadius), point(1, t0, endRadius), point(1, t1, endRadius)]))
      polygons.push(poly3.fromPoints([end, point(1, t1, endRadius), point(1, t0, endRadius)]))
    } else {
      if (startRadius[0] > 0) {
        polygons.push(poly3.fromPoints([start, point(0, t0, startRadius), point(0, t1, startRadius)]))
        polygons.push(poly3.fromPoints([point(0, t0, startRadius), point(1, t0, endRadius), point(0, t1, startRadius)]))
      }
      if (endRadius[0] > 0) {
        polygons.push(poly3.fromPoints([end, point(1, t1, endRadius), point(1, t0, endRadius)]))
        polygons.push(poly3.fromPoints([point(1, t0, endRadius), point(1, t1, endRadius), point(0, t1, startRadius)]))
      }
    }
  }
  let result = geom3.create(polygons)
  return result
}

module.exports = cylinderElliptic
