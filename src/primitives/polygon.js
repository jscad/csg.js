const geom2 = require('../geometry/geom2')

/**
 * Construct a polygon from a list of points, or list of points and paths.
 * NOTE: The order of points as specified by the paths is VERY IMPORTANT.
 * @param {Object} [options] - options for construction or either flat or nested array of points
 * @param {Array} [options.points] - points of the polygon : either flat or nested array of points
 * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of points index
 * @returns {geom2} new 2D geometry
 *
 * @example
 * let roof = [[10,11], [0,11], [5,20]]
 * let wall = [[0,0], [10,0], [10,10], [0,10]]
 *
 * let poly = polygon(roof)
 * or
 * let poly = polygon([roof, wall])
 * or
 * let poly = polygon({ points: roof })
 * or
 * let poly = polygon({ points: [roof, wall] })
 * or
 * let poly = polygon({ points: roof, paths: [0, 1, 2] })
 * or
 * let poly = polygon({ points: [roof, wall], paths: [[0, 1, 2], [3, 4, 5, 6]] })
 * or
 * let poly = polygon({ points: roof.concat(wall), paths: [[0, 1, 2], [3, 4, 5], [3, 6, 5]] })
 */
const polygon = (param1, param2) => {
  let points = null
  let paths = null
  if (param1 !== undefined) {
    if (Array.isArray(param1)) {
      points = param1
    } else {
      if ('points' in param1 && Array.isArray(param1.points)) points = param1.points
      if ('paths' in param1 && Array.isArray(param1.paths)) paths = param1.paths
    }
  }
  if (param2 !== undefined) {
    if (Array.isArray(param2)) {
      paths = param2
    } else {
      if ('points' in param2 && Array.isArray(param2.points)) points = param2.points
      if ('paths' in param2 && Array.isArray(param2.paths)) paths = param2.paths
    }
  }
  if (points === null) throw new Error('points are required')
  if (paths === null) {
    // generate a path for the points
    path = points.map((point, i) => i)
    paths = [path]
  }

  // convert to list of lists
  const list = paths.map((path) => path.map((i) => points[i]))

  let sides = []
  list.forEach((setofpoints) => {
    let geometry = geom2.fromPoints(setofpoints)
    sides = sides.concat(geom2.toSides(geometry))
  })
  return geom2.create(sides)
}

module.exports = polygon
