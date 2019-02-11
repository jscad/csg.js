const map = require('./map')

/**
 * @param {Array[]} vertices - list of vertices
 * @param {plane} [plane] - plane of the polygon
 */
const fromPointsAndPlane = (vertices, plane) => {
  const out = map(vertices)
  out.plane = plane
}

module.exports = fromPointsAndPlane
