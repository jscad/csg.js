const vec2 = require('../../math/vec2')

// FIXME: How should these constants be handled properly?
const angleEPS = 0.10
const defaultResolution2D = 32

/** Construct the points of an arc of a circle.
 * @param {Object} [options] - options for construction
 * @param {vec2} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
 * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
 * @returns {Array<vec2>} an array of points.
 *
 * @example
 * let points = buildCircularArc({
 *   center: [5, 5],
 *   radius: 10,
 *   startangle: 90,
 *   endangle: 180,
 *   resolution: 36,
 *   maketangent: true
 * })
 */
const buildCircularArc = ({ center = [0, 0], radius = 1, startangle = 0, endangle = 360, resolution = defaultResolution2D, maketangent = false }) => {
  // no need to make multiple turns:
  while (endangle - startangle >= 720) {
    endangle -= 360
  }
  while (endangle - startangle <= -720) {
    endangle += 360
  }
  let points = []
  let absangledif = Math.abs(endangle - startangle)
  if (absangledif < angleEPS) {
    const point = vec2.multiply(vec2.fromAngle(startangle / 180.0 * Math.PI), vec2.fromScalar(radius))
    points.push(vec2.add(point, center))
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
      const point = vec2.multiply(vec2.fromAngle(angle / 180.0 * Math.PI), vec2.fromScalar(radius))
      points.push(vec2.add(point, center))
    }
  }

  return points
}

module.exports = buildCircularArc
