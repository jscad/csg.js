const canonicalize = require('./canonicalize')
const create = require('./create')

/**
 * Call a function with each significant point in the surface, in no particular
 * order. This is mostly useful for generating a point cloud, bounds, etc.
 * @param {object} options - options for selecting the points.
 * @param {function} thunk - the function to call for each point.
 * @param {surface} surface - the surface to get the points of.
 */
const eachPoint = (options, thunk, surface) => {
  canonicalize(surface).polygons.forEach(polygon => polygon.forEach(thunk));
}

module.exports = eachPoint
