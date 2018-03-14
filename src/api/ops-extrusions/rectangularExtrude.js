const Path2 = require('../../core/math/Path2')
const Vertex2 = require('../../core/math/Vertex2')
const Side = require('../../core/math/Side')
const {fromSides} = require('../../core/CAGFactories')
const {extrude} = require('./extrusionUtils')
const expandedShell = require('../ops-transformations/expandedShell')

/** rectangular extrusion of the given array of points
 * Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
 * @param {Object} [options] - options for construction
 * @param {Float} [options.h=1] - height of the extruded shape in the z direction
 * @param {Float} [options.w=10] - width of the extruded shape in the z=0 plane
 * @param {Integer} [options.fn=1] - resolution/number of segments of the extrusion resolution: number of segments per 360 degrees for the curve in a corner
 * @param {Boolean} [options.closed=false] - whether to close the input path for the extrusion or not
 * @param {Boolean} [options.round=true] - whether to round the extrusion or not
 * @param {Array} basePoints array of points (nested) to extrude from
 * layed out like [ [0,0], [10,0], [5,10], [0,10] ]
 * @returns {CSG} new extruded shape
 *
 * @example
 * let revolved = rectangularExtrude({height: 10}, square())
 */
function rectangularExtrude (params, basePoints) {
  const defaults = {
    w: 1,
    h: 1,
    fn: 8,
    closed: false,
    round: true
  }
  // FIXME ! turns out 'round' is not used
  const {w, h, fn, closed} = Object.assign({}, defaults, params)
  const path = new Path2(basePoints, closed)
  let cag = expandToCAG(path, w / 2, fn)
  let result = extrude(cag, {
    offset: [0, 0, h]
  })
  return result
  // return rectangularExtrude(w, h, fn, round)
}

// Expand the path to a CAG
// This traces the path with a circle with radius pathradius
const expandToCAG = (path, pathradius, resolution) => {
  let sides = []
  let numpoints = path.points.length
  let startindex = 0
  if (path.closed && (numpoints > 2)) startindex = -1
  let prevvertex
  for (let i = startindex; i < numpoints; i++) {
    let pointindex = i
    if (pointindex < 0) pointindex = numpoints - 1
    let point = path.points[pointindex]
    let vertex = new Vertex2(point)
    if (i > startindex) {
      let side = new Side(prevvertex, vertex)
      sides.push(side)
    }
    prevvertex = vertex
  }
  let shellcag = fromSides(sides)
  let expanded = expandedShell(shellcag, pathradius, resolution)
  return expanded
}

module.exports = rectangularExtrude
