const vec3 = require('../math/vec3')

const poly3 = require('../geometry/poly3')
const shape3 = require('../shape3')

/** Construct a polyhedron from the given faces and vertices.
 * See face-vertex meshes for more information.
 * @param {Object} options - options for construction
 * @param {Array} options.faces - face definitions to build the polyhedron from
 * @param {Array} options.vertices - vertices to build the polyhedron from
 * @param {Array} options.colors - colors to apply to the polygons of the polyhedron
 * @returns {shape3} a new 3D shape
 */
const generatePolyhedron = (params) => {
  let faces = params.faces
  let vertices = params.vertices
  let colors = params.colors || null

  let polygons = []
  for (let i = 0; i < faces.length; i++) {
    let pp = []
    for (let j = 0; j < faces[i].length; j++) {
      pp[j] = vertices[faces[i][j]]
    }

    // Openscad convention defines inward normals - so we have to invert here
    // --- we reverse order for examples of OpenSCAD work
    // TODO: should we support both windings via another option?
    let v = []
    for (let j = faces[i].length - 1; j >= 0; j--) {
      v.push(vec3.fromValues(pp[j][0], pp[j][1], pp[j][2]))
    // TODO let s = Polygon3.defaultShared
    //if (colors && colors[i]) {
    //  s = Polygon3.Shared.fromColor(colors[i])
    //}
    }
    polygons.push(poly3.fromPoints(v))
  }
  const result = shape3.fromPolygons(polygons)
  return result
}

module.exports = generatePolyhedron
