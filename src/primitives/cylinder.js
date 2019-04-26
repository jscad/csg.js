const {defaultResolution3D} = require('../core/constants')

const vec3 = require('../math/vec3')

const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/** Construct a solid cylinder.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Number} [options.startRadisu=1] - radius of cylinder at the start
 * @param {Array} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.endRadius=1] - radius of cylinder at the end
 * @param {Number} [options.endAngle=360] - end angle of cylinder
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {geom3} new geometry
 *
 * @example
 * let cylinder = cylinder({
 *   start: [0, -10, 0],
 *   startRadis: 10,
 *   end: [0, 10, 0],
 *   endRadis: 5,
 *   resolution: 16
 * })
 */
const cylinder = function (options) {
  const defaults = {
    start: [0, -1, 0],
    startRadius: 1,
    end: [0, 1, 0],
    endRadius: 1,
    endAngle: 360,
    resolution: defaultResolution3D
  }
  let {start, startRadius, end, endRadius, endAngle, resolution} = Object.assign({}, defaults, options)

  let alpha = endAngle > 360 ? endAngle % 360 : endAngle

  if ((endRadius <= 0) || (startRadius <= 0)) {
    throw new Error('endRadius and startRadius should be positive')
  }

  let endv = vec3.fromArray(end)
  let startv = vec3.fromArray(start)
  let ray = vec3.subtract(endv, startv)

  let axisZ = vec3.unit(ray)
  let axisX = vec3.unit(vec3.random(axisZ))
  let axisY = vec3.unit(vec3.cross(axisX, axisZ))

  function point (stack, slice, radius) {
    let angle = slice * Math.PI * alpha / 180 // FIXME this scales the angles to meet the final alpha angle
    let out = vec3.add(vec3.scale(Math.cos(angle), axisX), vec3.scale(Math.sin(angle), axisY))
    let pos = vec3.add(vec3.add(startv, vec3.scale(stack, ray)), vec3.scale(radius, out))
    return pos
  }

  let polygons = []

  if (alpha > 0) {
    for (let i = 0; i < resolution; i++) {
      let t0 = i / resolution
      let t1 = (i + 1) / resolution
      if (endRadius === startRadius) {
        polygons.push(poly3.fromPoints([startv, point(0, t0, endRadius), point(0, t1, endRadius)]))
        polygons.push(poly3.fromPoints([point(0, t1, endRadius), point(0, t0, endRadius), point(1, t0, endRadius), point(1, t1, endRadius)]))
        polygons.push(poly3.fromPoints([endv, point(1, t1, endRadius), point(1, t0, endRadius)]))
      } else {
        if (startRadius > 0) {
          polygons.push(poly3.fromPoints([startv, point(0, t0, startRadius), point(0, t1, startRadius)]))
          polygons.push(poly3.fromPoints([point(0, t0, startRadius), point(1, t0, endRadius), point(0, t1, startRadius)]))
        }
        if (endRadius > 0) {
          polygons.push(poly3.fromPoints([endv, point(1, t1, endRadius), point(1, t0, endRadius)]))
          polygons.push(poly3.fromPoints([point(1, t0, endRadius), point(1, t1, endRadius), point(0, t1, startRadius)]))
        }
      }
    }
    if (alpha < 360) {
      polygons.push(poly3.fromPoints([startv, endv, point(0, 0, startRadius)]))
      polygons.push(poly3.fromPoints([point(0, 0, startRadius), endv, point(1, 0, endRadius)]))
      polygons.push(poly3.fromPoints([startv, point(0, 1, startRadius), endv]))
      polygons.push(poly3.fromPoints([point(0, 1, startRadius), point(1, 1, endRadius), endv]))
    }
  }
  let result = geom3.create(polygons)
  return result
}

module.exports = cylinder
