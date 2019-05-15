const {defaultResolution3D, EPS} = require('../core/constants')

const vec3 = require('../math/vec3')

const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/** Construct a cylinder with rounded ends.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Array} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let mycylinder = roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   roundRadius: 0.5
 * })
 */
const roundedCylinder = function (options) {
  const defaults = {
    start: [0, -1, 0],
    end: [0, 1, 0],
    radius: 1,
    roundRadius: 0.2,
    resolution: defaultResolution3D
  }
  let {start, end, radius, roundRadius, resolution} = Object.assign({}, defaults, options)

  if (roundRadius > (radius - EPS)) throw new Error('roundRadius must be smaller then the radius')

  if (resolution < 4) throw new Error('resolution must be four or more')

  let direction = vec3.subtract(end, start)
  let length = vec3.length(direction)

  if ((2*roundRadius) > (length - EPS)) throw new Error('the cylinder height must be larger than twice roundRadius')

  let defaultnormal
  if (Math.abs(direction[0]) > Math.abs(direction[1])) {
    defaultnormal = vec3.fromValues(0, 1, 0)
  } else {
    defaultnormal = vec3.fromValues(1, 0, 0)
  }

  let zvector = vec3.scale(roundRadius, vec3.unit(direction))
  let xvector = vec3.scale(radius, vec3.unit(vec3.cross(zvector, defaultnormal)))
  let yvector = vec3.scale(radius, vec3.unit(vec3.cross(xvector, zvector)))

  vec3.add(start, start, zvector)
  vec3.subtract(end, end, zvector)

  let qresolution = Math.floor(0.25 * resolution)

  let polygons = []
  let prevcylinderpoint
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))
    if (slice1 > 0) {
      // cylinder wall
      let points = []
      points.push(vec3.add(start, cylinderpoint))
      points.push(vec3.add(start, prevcylinderpoint))
      points.push(vec3.add(end, prevcylinderpoint))
      points.push(vec3.add(end, cylinderpoint))
      polygons.push(poly3.fromPoints(points))

      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          // cylinder rounding, start
          points = []
          let point
          point = vec3.add(start, vec3.subtract(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector)))
          points.push(point)
          point = vec3.add(start, vec3.subtract(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector)))
          points.push(point)
          if (slice2 < qresolution) {
            point = vec3.add(start, vec3.subtract(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector)))
            points.push(point)
          }
          point = vec3.add(start, vec3.subtract(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector)))
          points.push(point)

          polygons.push(poly3.fromPoints(points))

          // cylinder rounding, end
          points = []
          point = vec3.add(end, vec3.add(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector)))
          points.push(point)
          point = vec3.add(end, vec3.add(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector)))
          points.push(point)
          if (slice2 < qresolution) {
            point = vec3.add(end, vec3.add(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector)))
            points.push(point)
          }
          point = vec3.add(end, vec3.add(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector)))
          points.push(point)
          points.reverse()

          polygons.push(poly3.fromPoints(points))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = geom3.create(polygons)
  return result
}

module.exports = roundedCylinder
