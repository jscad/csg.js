const test = require('ava')
const plane = require('../plane/')

const { intersectToPlane, fromPoints } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line3: intersectToPlane() should return a new line3 with correct values', (t) => {
  const planeXY = plane.fromVec3s([0, 0, 0], [1, 0, 0], [1, 1, 0]) // flat on XY
  const planeXZ = plane.fromVec3s([0, 0, 0], [1, 0, 0], [0, 0, 1]) // flat on XZ
  const planeYZ = plane.fromVec3s([0, 0, 0], [0, 1, 0], [0, 0, 1]) // flat on YZ

  const line1 = fromPoints([0, 0, 0], [1, 0, 0])
  const line2 = fromPoints([1, 0, 0], [1, 1, 0])
  const line3 = fromPoints([0, 6, 0], [0, 0, 6])

  let obs = intersectToPlane(planeXY, line1) // no intersection, line on plane
  t.true(compareVectors(obs, [NaN, NaN, NaN]))

  obs = intersectToPlane(planeXY, line3)
  t.true(compareVectors(obs, [0, 6, 0]))

  obs = intersectToPlane(planeXZ, line3)
  t.true(compareVectors(obs, [0, 0, 6]))

  obs = intersectToPlane(planeYZ, line2) // no intersection, line parallel to plane
  t.true(compareVectors(obs, [NaN, Infinity, NaN]))
})
