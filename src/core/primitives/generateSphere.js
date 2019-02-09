const vec3 = require('../math/vec3')

const poly3 = require('../geometry/poly3')
const shape3 = require('../shape3')

/** Construct a solid sphere NON API !!
 * @param {Object} options - options for construction
 * @param {Vector3} options.center - center of sphere
 * @param {Number} options.radius - radius of sphere
 * @param {Number} options.segments - number of segments in the sphere, per 360 degrees
 * @param {Array} options.axes - an array with 3 vectors for the x, y and z base vectors
 * @returns {CSG} new 3D solid
 *
 *
 * @example
 * let sphere = CSG.sphere({
 *   center: [0, 0, 0],
 *   radius: 2,
 *   segments: 32,
 * });
 */
const generateSphere = function (options) {
  let center = options.center
  let radius = options.radius
  let segments = Math.round(options.segments)

  let xvector = vec3.scale(radius, vec3.fromValues(1, 0, 0))
  let yvector = vec3.scale(radius, vec3.fromValues(0, -1, 0))
  let zvector = vec3.scale(radius, vec3.fromValues(0, 0, 1))
  if ('axes' in options) {
    xvector = options.axes[0].unit().times(radius)
    yvector = options.axes[1].unit().times(radius)
    zvector = options.axes[2].unit().times(radius)
  }

  let qsegments = Math.round(segments / 2)
  let prevcylinderpoint
  let polygons = []
  for (let slice1 = 0; slice1 <= segments; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / segments
    let cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))
    if (slice1 > 0) {
      // cylinder vertices:
      let vertices = []
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qsegments; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qsegments
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          let cz = vec3.scale(sinpitch, zvector)
          let pz = vec3.scale(prevsinpitch, zvector)

          let ppp = vec3.scale(prevcospitch, prevcylinderpoint)
          let pcp = vec3.scale(prevcospitch, cylinderpoint)
          let ccp = vec3.scale(cospitch, cylinderpoint)
          let cpp = vec3.scale(cospitch, prevcylinderpoint)

          let p1 = vec3.subtract(ppp, pz)
          let p2 = vec3.subtract(pcp, pz)
          let p3 = vec3.subtract(ccp, cz)
          let p4 = vec3.subtract(cpp, cz)

          vertices = []
          vertices.push(vec3.add(center, p1))
          vertices.push(vec3.add(center, p2))
          if (slice2 < qsegments) {
            vertices.push(vec3.add(center, p3))
          }
          vertices.push(vec3.add(center, p4))
          polygons.push(poly3.fromPoints(vertices))

          p1 = vec3.add(ppp, pz)
          p2 = vec3.add(pcp, pz)
          p3 = vec3.add(ccp, cz)
          p4 = vec3.add(cpp, cz)

          vertices = []
          vertices.push(vec3.add(center, p1))
          vertices.push(vec3.add(center, p2))
          if (slice2 < qsegments) {
            vertices.push(vec3.add(center, p3))
          }
          vertices.push(vec3.add(center, p4))
          vertices.reverse()
          polygons.push(poly3.fromPoints(vertices))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  let result = shape3.fromPolygons(polygons)
console.log(shape3.toString(result))

  //result.properties.sphere = new Properties()
  //result.properties.sphere.center = new Vector3(center)
  //result.properties.sphere.facepoint = center.plus(xvector)
  return result
}

module.exports = generateSphere
