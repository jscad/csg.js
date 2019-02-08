const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')

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

const box4Polygons =
    [
      [[ 0,  0,  0], [ 0,  0, 10], [ 0, 10, 10], [ 0, 10,  0]],
      [[10,  0,  0], [10, 10,  0], [10, 10, 10], [10,  0, 10]],
      [[ 0,  0,  0], [10,  0,  0], [10,  0, 10], [ 0,  0, 10]],
      [[ 0, 10,  0], [ 0, 10, 10], [10, 10, 10], [10, 10,  0]],
      [[ 0,  0,  0], [ 0, 10,  0], [10, 10,  0], [10,  0,  0]],
      [[ 0,  0, 10], [10,  0, 10], [10, 10, 10], [ 0, 10, 10]]
    ]

test('retessellate: retessellate() produces an empty geometry from an empty geometry', t => {
  const empty = fromPolygonArray({}, [])

  t.deepEqual(toPolygonArray({}, empty), [])
})

test('Retessellation of a single solid does nothing', t => {
  const box1 = fromPolygonArray({}, box1Polygons)

  t.deepEqual(toPolygonArray({}, box1), box1Polygons)
})

test('Retessellation of two non-overlapping solids does nothing', t => {
  const box1AndBox2 = fromPolygonArray({}, [...box1Polygons, ...box2Polygons])

  t.deepEqual(toPolygonArray({}, box1AndBox2), [...box1Polygons, ...box2Polygons])
})

test('Retessellation of two face-touching solids does nothing', t => {
  const box1AndBox3 = fromPolygonArray({}, [...box1Polygons, ...box3Polygons])

  t.deepEqual(toPolygonArray({}, box1AndBox3), [...box1Polygons, ...box3Polygons])
})

test('Retessellation of two overlaping solids does nothing', t => {
  const box1AndBox4 = fromPolygonArray({}, [...box1Polygons, ...box4Polygons])

  t.deepEqual(toPolygonArray({}, box1AndBox4), [...box1Polygons, ...box4Polygons])
})

// TODO: We really need a test where retessellation actually does something ...
