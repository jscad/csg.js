const test = require('ava')
const plane = require('../plane/')

const { intersectWithPlane, fromPoints, toString } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line3: intersectWithPlane() should return a new line3 with correct values', (t) => {
  const planeXY = plane.fromVec3s([0, 0, 0], [1, 0, 0], [1, 1, 0]) // flat on XY
  const planeXZ = plane.fromVec3s([0, 0, 0], [1, 0, 0], [0, 0, 1]) // flat on XZ
  const planeYZ = plane.fromVec3s([0, 0, 0], [0, 1, 0], [0, 0, 1]) // flat on YZ

  const line1 = fromPoints([0, 0, 0], [1, 0, 0])
  const line2 = fromPoints([1, 0, 0], [1, 1, 0])
  const line3 = fromPoints([0, 6, 0], [0, 0, 6])

  let obs = intersectWithPlane(planeXY, line1) // no intersection, line on plane
  t.true(compareVectors(obs, [NaN, NaN, NaN]))

  obs = intersectWithPlane(planeXY, line3)
  t.true(compareVectors(obs, [0, 6, 0]))

  obs = intersectWithPlane(planeXZ, line3)
  t.true(compareVectors(obs, [0, 0, 6]))

  obs = intersectWithPlane(planeYZ, line2) // no intersection, line parallel to plane
  t.true(compareVectors(obs, [NaN, Infinity, NaN]))
})
