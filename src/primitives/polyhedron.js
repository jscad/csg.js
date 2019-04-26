const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/** Create a polyhedron from the given set of points and faces.
 * The faces can define outward or inward facing polygons (see the options).
 * However, the face must define a counter clockwise rotation of points, i.e. right hand rule.
 * @param {Object} options - options for construction
 * @param {Array} options.points=[] - list of points in 3D space
 * @param {Array} options.faces=[] - list of faces, where each face is a set of indexes into the points
 * @param {Array} [options.normals='outward'] - direction of faces
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let mypoints = 
 * let myfaces = 
 * let mygeometry = polyhedron({points: mypoint, faces: myfaces})
 */
const polyhedron = (options) => {
  const defaults = {
    points: [],
    faces: [],
    normals: 'outward'
  }
  const {points, faces, normals} = Object.assign({}, defaults, options)

  if (!(Array.isArray(points) && Array.isArray(faces))) {
    throw new Error('points and faces must be arrays')
  }
  if (points.length === 0) {
    throw new Error('points cannot be empty')
  }
  if (faces.length === 0) {
    throw new Error('faces cannot be empty')
  }

  // invert the faces if facing inwards, as all internals expect outwarding facing polygons
  if (normals !== 'outward') {
    faces.forEach((face) => face.reverse())
  }

  let polygons = faces.map((face) => {
    return poly3.fromPoints(face.map((idx) => points[idx]))
  })
  return geom3.create(polygons)
}

module.exports = polyhedron
