const test = require('ava')

const { isConvex, create, fromPoints } = require('./index')

test('poly3: empty poly3 is convex', (t) => {
  const ply1 = create()
  t.true(isConvex(ply1))
})

test('poly3: convex poly3 is convex', (t) => {
  const ply2 = fromPoints([[1, 1, 0], [1, 0, 0], [0, 0, 0]])
  t.true(isConvex(ply2))
})

test('poly3: ccw poly3 is convex', (t) => {
  const points2ccw = [[0, 0, 3], [10, 10, 3], [0, 5, 3]]
  const ply3 = fromPoints(points2ccw)
  t.true(isConvex(ply3))
})

test('poly3: cw poly3 is convex', (t) => {
  const points2cw = [[0, 0, 3], [-10, 10, 3], [0, 5, 3]]
  const ply4 = fromPoints(points2cw)
  t.true(isConvex(ply4))
})

test('poly3: v shaped poly3 is not convex', (t) => {
  // V-shape
  const pointsV = [[0, 0, 3], [-10, 10, 3], [0, 5, 3], [10, 10, 3]]
  const ply5 = fromPoints(pointsV)
  t.false(isConvex(ply5))
})
