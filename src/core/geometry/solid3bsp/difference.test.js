const create = require('./create')
const difference = require('./difference')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')

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
      [[-5, -5,  5], [-5,  5,  5], [ 5,  5, 5],  [ 5, -5,  5]],
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

const box1DifferenceBox4Polygons =
    [
      [[-5, -5, -5], [-5, -5, 5], [-5, 5, 5], [-5, 5, -5]],
      [[-5, -5, -5], [5, -5, -5], [5, -5, 5], [-5, -5, 5]],
      [[-5, -5, -5], [-5, 5, -5], [5, 5, -5], [5, -5, -5]],
      [[0, 5, 0], [0, 5, 5], [0, 0, 5], [0, 0, 0]],
      [[0, 0, 5], [5, 0, 5], [5, 0, 0], [0, 0, 0]],
      [[5, 0, 0], [5, 5, 0], [0, 5, 0], [0, 0, 0]],
      [[5, -5, -5], [5, 0, -5], [5, 0, 5], [5, -5, 5]],
      [[0, 5, -5], [-5, 5, -5], [-5, 5, 5], [0, 5, 5]],
      [[-5, -5, 5], [0, -5, 5], [0, 5, 5], [-5, 5, 5]],
      [[5, 0, 0], [5, 0, -5], [5, 5, -5], [5, 5, 0]],
      [[0, 5, -5], [0, 5, 0], [5, 5, 0], [5, 5, -5]],
      [[0, 0, 5], [0, -5, 5], [5, -5, 5], [5, 0, 5]]
    ]


test('Difference of zero solids is an empty solid', t => {
  const empty = fromPolygonArray({}, [])
  t.true(equals(difference(), empty))
})

test('Difference of one solid is that solid', t => {
  const empty = fromPolygonArray({}, [])
  t.is(difference(empty), empty)
})

test('difference() should create proper empty geometries from empty geometries', (t) => {
  const empty = fromPolygonArray({}, [])

  // Test for one, two and three.
  t.true(equals(empty, difference(empty)))
  t.true(equals(empty, difference(empty, empty)))
  t.true(equals(empty, difference(empty, empty, empty)))
})


test('Difference of two non-overlapping solids is the first solid', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box2 = fromPolygonArray({}, box2Polygons)

  t.true(equals(difference(box1, box2), box1))
})


test('Difference of two face touching solids is the first solid', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box3 = fromPolygonArray({}, box3Polygons)

  t.true(equals(difference(box1, box3), box1))
})

test('Difference of two overlapping solids is the first solid less the second', t => {
  const box1 = fromPolygonArray({}, box1Polygons)
  const box4 = fromPolygonArray({}, box4Polygons)
  const box1DifferenceBox4 = fromPolygonArray({}, box1DifferenceBox4Polygons)

  t.true(equals(difference(box1, box4), box1DifferenceBox4))
})
