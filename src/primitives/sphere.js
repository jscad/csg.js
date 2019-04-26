const {defaultResolution3D} = require('../core/constants')

const vec3 = require('../math/vec3')

const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/**
 * Construct a solid sphere
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of sphere
 * @param {Number} [options.radius=1] - radius of sphere
 * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
 * @param {Array} [options.axes] -  an array with three vectors for the x, y and z base vectors
 * @returns {geom3} new 3D geometry
*/
const sphere = (options) => {
  const defaults = {
    center: [0, 0, 0],
    radius: 1,
    resolution: defaultResolution3D,
    axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
  }
  let {center, radius, resolution, axes} = Object.assign({}, defaults, options)

  let xvector = vec3.scale(radius, vec3.unit(axes[0]))
  let yvector = vec3.scale(radius, vec3.unit(axes[1]))
  let zvector = vec3.scale(radius, vec3.unit(axes[2]))

  if (resolution < 4) resolution = 4

  let qresolution = Math.round(resolution / 4)
  let prevcylinderpoint
  let polygons = []
  for (let slice1 = 0; slice1 <= resolution; slice1++) {
    let angle = Math.PI * 2.0 * slice1 / resolution
    let cylinderpoint = vec3.add(vec3.scale(Math.cos(angle), xvector), vec3.scale(Math.sin(angle), yvector))
    if (slice1 > 0) {
      // cylinder vertices:
      let vertices = []
      let prevcospitch, prevsinpitch
      for (let slice2 = 0; slice2 <= qresolution; slice2++) {
        let pitch = 0.5 * Math.PI * slice2 / qresolution
        let cospitch = Math.cos(pitch)
        let sinpitch = Math.sin(pitch)
        if (slice2 > 0) {
          let points = []
          let point
          point = vec3.subtract(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector))
          points.push(vec3.add(center, point))
          point = vec3.subtract(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector))
          points.push(vec3.add(center, point))
          if (slice2 < qresolution) {
            point = vec3.subtract(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector))
            points.push(vec3.add(center, point))
          }
          point = vec3.subtract(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector))
          points.push(vec3.add(center, point))

          polygons.push(poly3.fromPoints(points))

          points = []
          point = vec3.add(vec3.scale(prevcospitch, prevcylinderpoint), vec3.scale(prevsinpitch, zvector))
          points.push(vec3.add(center, point))
          point = vec3.add(vec3.scale(prevcospitch, cylinderpoint), vec3.scale(prevsinpitch, zvector))
          points.push(vec3.add(center, point))
          if (slice2 < qresolution) {
            point = vec3.add(vec3.scale(cospitch, cylinderpoint), vec3.scale(sinpitch, zvector))
            points.push(vec3.add(center, point))
          }
          point = vec3.add(vec3.scale(cospitch, prevcylinderpoint), vec3.scale(sinpitch, zvector))
          points.push(vec3.add(center, point))
          points.reverse()

          polygons.push(poly3.fromPoints(points))
        }
        prevcospitch = cospitch
        prevsinpitch = sinpitch
      }
    }
    prevcylinderpoint = cylinderpoint
  }
  return geom3.create(polygons)
}

module.exports = sphere
