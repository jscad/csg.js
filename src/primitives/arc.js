const {EPS, defaultResolution2D} = require('../core/constants')

const {degToRad, radToDeg} = require('../math/utils')

const vec2 = require('../math/vec2')

const path2 = require('../geometry/path2')

/** Construct an arc.
 * @param {Object} options - options for construction
 * @param {Array} options.center - center of circle
 * @param {Number} options.radius - radius of circle
 * @param {Number} options.startangle - starting angle of the arc, in degrees
 * @param {Number} options.endangle - ending angle of the arc, in degrees
 * @param {Number} options.segments - number of segments to create per 360 rotation
 * @param {Boolean} options.maketangent - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
 * @returns {path} new path (not closed)
 */
const arc = function (options) {
  const defaults = {
    center: [0, 0],
    radius: 1,
    startangle: 0,
    endangle: 360,
    maketangent: false,
    segments: defaultResolution2D
  }
  let {center, radius, startangle, endangle, maketangent, segments} = Object.assign({}, defaults, options)

  if (startangle < 0 || endangle < 0) throw new Error('the start and end angles must be positive')
  if (segments < 4) throw new Error('segments must be four or more')

  startangle = startangle % 360
  endangle = endangle % 360

  let rotation = 360
  if (startangle < endangle) {
    rotation = endangle - startangle
  }
  if (startangle > endangle) {
    rotation = endangle + (360 - startangle)
  }

  let minangle = radToDeg(Math.acos(((radius * radius) + (radius * radius) - (EPS * EPS)) / (2 * radius * radius)))

  let centerv = vec2.fromArray(center)
  let point
  let pointArray = []
  if (rotation < minangle) {
    // there is no rotation, just a single point
    point = vec2.scale(radius, vec2.fromAngleDegrees(startangle))
    vec2.add(point, point, centerv)
    pointArray.push(point)
  } else {
    // note: add one additional step to acheive full rotation
    let numsteps = Math.max(1, Math.floor(segments * rotation / 360)) + 1
    let edgestepsize = numsteps * 0.5 / rotation // step size for half a degree
    if (edgestepsize > 0.25) edgestepsize = 0.25

    let totalsteps = maketangent ? (numsteps + 2) : numsteps
    for (let i = 0; i <= totalsteps; i++) {
      let step = i
      if (maketangent) {
        step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize
        if (step < 0) step = 0
        if (step > numsteps) step = numsteps
      }
      let angle = startangle + step * (rotation / numsteps)
      point = vec2.scale(radius, vec2.fromAngleDegrees(angle))
      vec2.add(point, point, centerv)
      pointArray.push(point)
    }
  }
  return path2.fromPoints({close: false}, pointArray)
}

module.exports = arc
