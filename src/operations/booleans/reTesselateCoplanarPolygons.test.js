const test = require('ava')

const {radToDeg, degToRad} = require('../../math/utils')

const {EPS} = require('../../math/constants')

const {mat4, vec3} = require('../../math')

const {geom2, geom3, poly3} = require('../../geometry')

const reTesselateCoplanarPolygons = require('./reTesselateCoplanarPolygons')

const {circle, rectangle} = require('../../primitives')

const translatePoly3 = (offsets, polygon) => {
  const matrix = mat4.fromTranslation(offsets)
  return poly3.transform(matrix, polygon)
}

const rotatePoly3 = (angles, polygon) => {
  const matrix = mat4.fromTaitBryanRotation(degToRad(angles[0]), degToRad(angles[1]), degToRad(angles[2]))
  return poly3.transform(matrix, polygon)
}

test.only('retessellateCoplanarPolygons: should merge coplanar polygons', (t) => {
  let points2D = geom2.toPoints(rectangle({radius: [5,5]}))
  let points3D = points2D.map((point) => vec3.fromVec2(point))
  const polyA = poly3.fromPoints([[-5, -5, 0], [ 5, -5, 0], [ 5,  5, 0], [-5, 5, 0]])
  const polyB = poly3.fromPoints([[ 5, -5, 0], [ 8,  0, 0], [ 5,  5, 0]])
  const polyC = poly3.fromPoints([[-5,  5, 0], [-8,  0, 0], [-5, -5, 0]])
  const polyD = poly3.fromPoints([[-5,  5, 0], [ 5,  5, 0], [ 0,  8, 0]])
  const polyE = poly3.fromPoints([[ 5, -5, 0], [-5, -5, 0], [ 0, -8, 0]])
  points2D = geom2.toPoints(rectangle({radius: [3,3]}))
  points3D = points2D.map((point) => vec3.fromVec2(point))
  const polyZ = poly3.fromPoints(points3D)
  const polyY = translatePoly3([2, 8, 0], polyZ)

  // combine polygons in each direction
  let obs = reTesselateCoplanarPolygons([polyA, polyB])
  t.is(obs.length, 1)
  obs = reTesselateCoplanarPolygons([polyA, polyC])
  t.is(obs.length, 1)
  obs = reTesselateCoplanarPolygons([polyA, polyD])
  t.is(obs.length, 1)
  obs = reTesselateCoplanarPolygons([polyA, polyE])
  t.is(obs.length, 1)

  // combine several polygons in each direction
  obs = reTesselateCoplanarPolygons([polyB, polyA, polyC])
  t.is(obs.length, 1)
  obs = reTesselateCoplanarPolygons([polyC, polyA, polyB])
  t.is(obs.length, 1)

  obs = reTesselateCoplanarPolygons([polyD, polyA, polyE])
  t.is(obs.length, 1)
  obs = reTesselateCoplanarPolygons([polyE, polyA, polyD])
  t.is(obs.length, 1)

  // combine all polygons
  obs = reTesselateCoplanarPolygons([polyA, polyB, polyC, polyD, polyE])
  t.is(obs.length, 1)

  // now rotate everything and do again
  let polyH = rotatePoly3([-45, -45, -45], polyA)
  let polyI = rotatePoly3([-45, -45, -45], polyB)
  let polyJ = rotatePoly3([-45, -45, -45], polyC)
  let polyK = rotatePoly3([-45, -45, -45], polyD)
  let polyL = rotatePoly3([-45, -45, -45], polyE)

  obs = reTesselateCoplanarPolygons([polyH, polyI, polyJ, polyK, polyL])
  t.is(obs.length, 1)

  // now translate everything and do again
  polyH = translatePoly3([-15, -15, -15], polyA)
  polyI = translatePoly3([-15, -15, -15], polyB)
  polyJ = translatePoly3([-15, -15, -15], polyC)
  polyK = translatePoly3([-15, -15, -15], polyD)
  polyL = translatePoly3([-15, -15, -15], polyE)

  obs = reTesselateCoplanarPolygons([polyH, polyI, polyJ, polyK, polyL])
  t.is(obs.length, 1)
})
