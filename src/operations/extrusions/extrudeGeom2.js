const {defaultResolution3D} = require('../../core/constants')

const {degToRad} = require('../../math/utils')

const {mat4, vec3} = require('../../math')

const {geom3, poly3} = require('../../geometry')

//const {Connector} = require('../core/connectors')

//const toWallPolygons = require('./toWallPolygons')

const to3DPolygons = require('./to3DPolygons')
const toVec3Pairs = require('./toVec3Pairs')

/**
 * Extrude the given geometry using the given options.
 * @param {Object} options - options for extrude
 * @param {Array} options.offset - the direction of the extrusion as a 3D vector
 * @param {Number} options.twistangle - the final rotatation (degrees) about the origin of the shape
 * @param {Integer} options.twiststeps - the resolution of the twist (if any) about the axis
 * @param {geom2} geometry - the geometry to extrude
 * @returns {geom3} the extruded 3D geometry
*/
const extrudeGeom2 = function (options, geometry) {
  const defaults = {
    offset: [0, 0, 1],
    twistangle: 0,
    twiststeps: defaultResolution3D
  }
  let {offset, twistangle, twiststeps} = Object.assign({}, defaults, options)

  // convert to vector inorder to perform math
  let offsetv = vec3.fromArray(offset)

  if (twistangle === 0 || twiststeps < 1) {
    twiststeps = 1
  }

  let flipped = (offsetv[2] < 0)
  let normalVector = vec3.fromArray([0, 1, 0]) // normal of Z axis

  let bottomAsPolygons = to3DPolygons({flipped: !flipped}, geometry)

  // bottom
  let polygons = []
  polygons = polygons.concat(bottomAsPolygons)

  // top
  let matrix = mat4.multiply(mat4.fromZRotation(degToRad(twistangle)), mat4.fromTranslation(offset))
  let topAsPolygons = bottomAsPolygons.map((polygon) => poly3.transform(matrix, poly3.flip(polygon)))
  polygons = polygons.concat(topAsPolygons)

  // walls
  let previousPairs = toVec3Pairs(mat4.identity(), geometry)
  if (flipped) previousPairs.forEach((pair) => pair.reverse())

  for (let i = 0; i < twiststeps; i++) {
    let rotationZ = (i + 1) / twiststeps * twistangle
    let offsetZ = vec3.scale((i + 1) / twiststeps, offsetv)
    let currentM = mat4.multiply(mat4.fromZRotation(degToRad(rotationZ)), mat4.fromTranslation(offsetZ))
    let currentPairs = toVec3Pairs(currentM, geometry)
    if (flipped) currentPairs.forEach((pair) => pair.reverse())

    previousPairs.forEach((p, i) => {
      polygons.push(poly3.fromPoints([currentPairs[i][1], currentPairs[i][0], previousPairs[i][0]]))
      polygons.push(poly3.fromPoints([currentPairs[i][1], previousPairs[i][0], previousPairs[i][1]]))
    })

    previousPairs = currentPairs
  }
  return geom3.create(polygons)
}

module.exports = extrudeGeom2
