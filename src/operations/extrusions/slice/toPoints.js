const toEdges = require('./toEdges')

/**
 * Produces an array of points from the given slice.
 * NOTE: The points returned do NOT define an order.
 * @param {slice} slice - the slice
 * @returns {Array} an array of points, where each point is a vec3
 * @example
 * let sharedpoints = toPoints(slice)
 */
const toPoints = (slice) => {
  const edges = toEdges(slice)
  return edges.map((edge) => edge[0])
}

module.exports = toPoints
