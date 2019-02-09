const vec3 = require('../math/vec3')

const poly3 = require('../geometry/poly3')
const shape3 = require('../shape3')

/** Construct a cylinder with rounded ends.
 * @param {Object} options - options for construction
 * @param {Vector3} options.start - start point of the cylinder
 * @param {Vector3} options.end - end point of the cylinder
 * @param {Number} options.radius - radius of the cylinder
 * @param {Integer} options.segments - number of segments in the cylinder, per 360 degrees
 * @param {Integer} options.roundsegments - number of segments in the rounded end, per 360 degrees
 * @returns {CSG} new 3D solid
 *
 * @example
 * let cylinder = CSG.roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   segments: 16
 * });
 */
const generateRoundedCylinder = function (options) {
  let start = options.start
  let end = options.end
  // FIXME the size of the cylinder is actually START+RADIUS by END+RADIUS
  let radius = options.radius
  let segments = Math.floor(options.segments)
  let roundsegments = Math.floor(options.roundsegments / 2)
  // let normal = options.normal // TODO direction, i.e. where to start the first segment

  let direction = vec3.subtract(end, start)
  let normal
  if (Math.abs(direction[0]) > Math.abs(direction[1])) {
    normal = vec3.fromValues(0, 1, 0)
  } else {
    normal = vec3.fromValues(1, 0, 0)
  }
  let zvector = vec3.scale(radius, vec3.unit(direction))
  let xvector = vec3.scale(radius, vec3.unit(vec3.cross(zvector, normal)))
  let yvector = vec3.scale(radius, vec3.unit(vec3.cross(xvector, zvector)))

  let prevcylinderpoint
  let polygons = []
  for (let slice1 = 0; slice1 <= segments; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / segments
    let cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))
    if (slice1 > 0) {
      // cylinder vertices:
      let vertices = []
      vertices.push(vec3.add(start, cylinderpoint))
      vertices.push(vec3.add(start, prevcylinderpoint))
      vertices.push(vec3.add(end, prevcylinderpoint))
      vertices.push(vec3.add(end, cylinderpoint))
      polygons.push(poly3.fromPoints(vertices))

      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= roundsegments; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / roundsegments
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
          vertices.push(vec3.add(start, p1))
          vertices.push(vec3.add(start, p2))
          if (slice2 < roundsegments) {
            vertices.push(vec3.add(start, p3))
          }
          vertices.push(vec3.add(start, p4))
          polygons.push(poly3.fromPoints(vertices))

          p1 = vec3.add(ppp, pz)
          p2 = vec3.add(pcp, pz)
          p3 = vec3.add(ccp, cz)
          p4 = vec3.add(cpp, cz)

          vertices = []
          vertices.push(vec3.add(end, p1))
          vertices.push(vec3.add(end, p2))
          if (slice2 < roundsegments) {
            vertices.push(vec3.add(end, p3))
          }
          vertices.push(vec3.add(end, p4))
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

  //let ray = vec3.unit(zvector)
  //let axisX = vec3.unit(xvector)
  //result.properties.roundedCylinder = new Properties()
  //result.properties.roundedCylinder.start = new Connector(start, ray.negated(), axisX)
  //result.properties.roundedCylinder.end = new Connector(end, ray, axisX)
  //result.properties.roundedCylinder.facepoint = start.plus(xvector)
  return result
}

module.exports = generateRoundedCylinder
