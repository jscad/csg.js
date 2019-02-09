const vec3 = require('../math/vec3')

const poly3 = require('../geometry/poly3')
const shape3 = require('../shape3')

/** Construct an axis-aligned solid cubiod.
 * @param {Object} options - options for construction
 * @param {vec3} options.center - center of cube
 * @param {vec3} options.radius - radius of cube
 * @returns {shape3} new 3D shape with initial transform and geometry
 *
 * @example
 * let shape = generateCuboid({center: [5, 5, 5], radius: [3, 5, 3]})
 */
const generateCuboid = function (options) {
  let c = options.center
  let r = options.radius
  let definition = [ // vertices per face, normal of face
    [[0, 4, 6, 2], [-1, 0, 0]],
    [[1, 3, 7, 5], [+1, 0, 0]],
    [[0, 1, 5, 4], [0, -1, 0]],
    [[2, 6, 7, 3], [0, +1, 0]],
    [[0, 2, 3, 1], [0, 0, -1]],
    [[4, 5, 7, 6], [0, 0, +1]]
  ]
  let result = shape3.fromPolygons(
    definition.map((face) => {
      let vertices = face[0].map(function (i) {
        return vec3.fromValues(
          c[0] + r[0] * (2 * !!(i & 1) - 1),
          c[1] + r[1] * (2 * !!(i & 2) - 1),
          c[2] + r[2] * (2 * !!(i & 4) - 1))
      })
      return poly3.fromPoints(vertices)
    })
  )
  // FIXME set properties
  result.properties.cube = {}
  result.properties.cube.center = c
  // add 6 connectors, at the centers of each face:
  //result.properties.cube.connectors = [
    //Vector3([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
    //Vector3([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
    //Vector3([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
    //Vector3([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
    //Vector3([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
    //Vector3([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0])
  //]
console.log(shape3.toString(result))
  return result
}

module.exports = generateCuboid
