const {angleEPS, defaultResolution2D} = require('../core/constants')

const vec2 = require('../math/vec2')

const path2 = require('../geometry/path2')

/** Construct an arc.
 * @param {Object} options - options for construction
 * @param {Array} options.center - center of circle
 * @param {Number} options.radius - radius of circle
 * @param {Number} options.startangle - starting angle of the arc, in degrees
 * @param {Number} options.endangle - ending angle of the arc, in degrees
 * @param {Number} options.resolution - number of segments to create, per 360 rotation
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
    resolution: defaultResolution2D
  }
  let {center, radius, startangle, endangle, maketangent, resolution} = Object.assign({}, defaults, options)

  // convert to vector in order to perform math
  centerv = vec2.fromArray(center)

  let pointArray = []
  let point
  let absangledif = Math.abs(endangle - startangle)
  if (absangledif < angleEPS) {
    point = vec3.scale(radius, vec3.fromAngleDegrees(startangle))
    vec2.add(point, point, centerv)
    pointArray.push([point[0], point[1]])
  } else {
    let numsteps = Math.floor(resolution * absangledif / 360) + 1
    let edgestepsize = numsteps * 0.5 / absangledif // step size for half a degree
    if (edgestepsize > 0.25) edgestepsize = 0.25
    let numstepsMod = maketangent ? (numsteps + 2) : numsteps
    for (let i = 0; i <= numstepsMod; i++) {
      let step = i
      if (maketangent) {
        step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize
        if (step < 0) step = 0
        if (step > numsteps) step = numsteps
      }
      let angle = startangle + step * (endangle - startangle) / numsteps
      point = vec2.scale(radius, vec2.fromAngleDegrees(angle))
      vec2.add(point, point, centerv)
      pointArray.push([point[0], point[1]])
    }
  }
  return path2.fromPoints({close: false}, pointArray)
}

module.exports = arc
