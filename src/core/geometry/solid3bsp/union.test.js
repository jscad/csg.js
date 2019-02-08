const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const union = require('./union')

const box1Polygons =
    [
      [[-5, -5, -5], [-5, -5,  5], [-5,  5,  5], [-5,  5, -5]],
      [[ 5, -5, -5], [ 5,  5, -5], [ 5,  5,  5], [ 5, -5,  5]],
      [[-5, -5, -5], [ 5, -5, -5], [ 5, -5,  5], [-5, -5,  5]],
      [[-5,  5, -5], [-5,  5,  5], [ 5,  5,  5], [ 5,  5, -5]],
      [[-5, -5, -5], [-5,  5, -5], [ 5,  5, -5], [ 5, -5, -5]],
      [[-5, -5,  5], [ 5, -5,  5], [ 5,  5,  5], [-5,  5,  5]]
    ]

const box2Polygons =
    [
      [[15, 15, 15], [15, 15, 25], [15, 25, 25], [15, 25, 15]],
      [[25, 15, 15], [25, 25, 15], [25, 25, 25], [25, 15, 25]],
      [[15, 15, 15], [25, 15, 15], [25, 15, 25], [15, 15, 25]],
      [[15, 25, 15], [15, 25, 25], [25, 25, 25], [25, 25, 15]],
      [[15, 15, 15], [15, 25, 15], [25, 25, 15], [25, 15, 15]],
      [[15, 15, 25], [25, 15, 25], [25, 25, 25], [15, 25, 25]]
    ]

const box3Polygons =
    [
      [[-5, -5,  5], [-5, -5, 15], [-5,  5, 15], [-5,  5,  5]],
      [[ 5, -5,  5], [ 5,  5,  5], [ 5,  5, 15], [ 5, -5, 15]],
      [[-5, -5,  5], [ 5, -5,  5], [ 5, -5, 15], [-5, -5, 15]],
      [[-5,  5,  5], [-5,  5, 15], [ 5,  5, 15], [ 5,  5,  5]],
      [[-5, -5,  5], [-5,  5,  5], [ 5,  5,  5], [ 5, -5,  5]],
      [[-5, -5, 15], [ 5, -5, 15], [ 5,  5, 15], [-5,  5, 15]]
    ]

const box1UnionBox3Polygons = [
      // box1
      [[-5, -5, -5], [-5, -5,  5], [-5,  5,  5], [-5,  5, -5]], 
      [[ 5, -5, -5], [ 5,  5, -5], [ 5,  5,  5], [ 5, -5,  5]], 
      [[-5, -5, -5], [ 5, -5, -5], [ 5, -5,  5], [-5, -5,  5]], 
      [[-5,  5, -5], [-5,  5,  5], [ 5,  5,  5], [ 5,  5, -5]], 
      [[-5, -5, -5], [-5,  5, -5], [ 5,  5, -5], [ 5, -5, -5]], 
      // [[-5, -5,  5], [ 5, -5,  5], [ 5,  5,  5], [-5,  5,  5]] // (touching face removed by union)

      // This face was removed from box3

      // box3
      [[-5, -5,  5], [-5, -5, 15], [-5,  5, 15], [-5,  5,  5]], 
      [[ 5, -5,  5], [ 5,  5,  5], [ 5,  5, 15], [ 5, -5, 15]], 
      [[-5, -5,  5], [ 5, -5,  5], [ 5, -5, 15], [-5, -5, 15]], 
      [[-5,  5,  5], [-5,  5, 15], [ 5,  5, 15], [ 5,  5,  5]], 
      // [[-5, -5,  5], [-5,  5,  5], [ 5,  5,  5], [ 5, -5,  5]], // (touching face removed by union)
      [[-5, -5, 15], [ 5, -5, 15], [ 5,  5, 15], [-5,  5, 15]]
    ]

const box4Polygons =
    [
      [[ 0,  0,  0], [ 0,  0, 10], [ 0, 10, 10], [ 0, 10,  0]],
      [[10,  0,  0], [10, 10,  0], [10, 10, 10], [10,  0, 10]],
      [[ 0,  0,  0], [10,  0,  0], [10,  0, 10], [ 0,  0, 10]],
      [[ 0, 10,  0], [ 0, 10, 10], [10, 10, 10], [10, 10,  0]],
      [[ 0,  0,  0], [ 0, 10,  0], [10, 10,  0], [10,  0,  0]],
      [[ 0,  0, 10], [10,  0, 10], [10, 10, 10], [ 0, 10, 10]]
    ]

const box1UnionBox4Polygons =
    [
      [[-5, -5, -5], [-5, -5,  5], [-5,  5,  5],[-5,  5, -5]],
      [[ 5, -5, -5], [ 5,  5, -5], [ 5,  5,  5],[ 5, -5,  5]],
      [[-5, -5, -5], [ 5, -5, -5], [ 5, -5,  5],[-5, -5,  5]],
      [[-5,  5, -5], [-5,  5,  5], [ 5,  5,  5],[ 5,  5, -5]],
      [[-5, -5, -5], [-5,  5, -5], [ 5,  5, -5],[ 5, -5, -5]],
      [[-5, -5,  5], [-5, -5, 15], [-5,  5, 15],[-5,  5,  5]],
      [[ 5, -5,  5], [ 5,  5,  5], [ 5,  5, 15],[ 5, -5, 15]],
      [[-5, -5,  5], [ 5, -5,  5], [ 5, -5, 15],[-5, -5, 15]],
      [[-5,  5,  5], [-5,  5, 15], [ 5,  5, 15],[ 5,  5,  5]],
      [[-5, -5, 15], [ 5, -5, 15], [ 5,  5, 15],[-5,  5, 15]]
    ]

test('union() produces empty solid', t => {
  const empty = fromPolygonArray({}, [])

  t.true(equals(union(), empty))
})

test('union(X) is X', t => {
  const solid = fromPolygonArray({}, [])

  t.is(union(solid), solid)
})

test('union of empty solids creates empty solids', t => {
  const empty = fromPolygonArray({}, [])

  // Test for one, two, and three solids.
  t.true(equals(union(empty), empty))
  t.true(equals(union(empty, empty), empty))
  t.true(equals(union(empty, empty, empty), empty))
})

test('union(a, b) for non-overlapping a and b', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box2 = fromPolygonArray({}, box2Polygons)
  const box1AndBox2 = fromPolygonArray({}, [...box1Polygons, ...box2Polygons])

  t.true(equals(union(box1, box2), box1AndBox2))
})

test('union(a, b) for face-touching a and b', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box3 = fromPolygonArray({}, box3Polygons)
  const box1UnionBox3 = fromPolygonArray({}, box1UnionBox3Polygons)

  t.true(equals(union(box1, box3), box1UnionBox3))
})

test('union(a, b) for overlapping a and b', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box4 = fromPolygonArray({}, box3Polygons)
  const box1UnionBox4 = fromPolygonArray({}, box1UnionBox4Polygons)

  t.true(equals(union(box1, box4), box1UnionBox4))
})
