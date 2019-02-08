const create = require('./create')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const intersection = require('./intersection')
const test = require('ava')

test('Intersection() of zero solids is empty solid', t => {
  t.true(equals(intersection(), create()))
})

test('Intersection() of one solid is that solid', t => {
  const solid = create()
  t.is(intersection(solid), solid)
})

test('Intersection() should create proper intersection from empty geometries', (t) => {
  // Test for one, two, and three solids.
  t.true(equals(intersection(create()), create()))
  t.true(equals(intersection(create(), create()), create()))
  t.true(equals(intersection(create(), create(), create()), create()))
})

// box1 does not intersect box2.
// box1 shares a face with box3.
// box1 intersects box4.

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

const box1AndBox4IntersectionPolygons =
    [
      [[ 0,  0,  0], [ 0,  0,  5], [ 0,  5,  5], [ 0,  5,  0]],
      [[ 0,  0,  0], [ 5,  0,  0], [ 5,  0,  5], [ 0,  0,  5]],
      [[ 0,  0,  0], [ 0,  5,  0], [ 5,  5,  0], [ 5,  0,  0]],
      [[ 5,  0,  0], [ 5,  5,  0], [ 5,  5,  5], [ 5,  0,  5]],
      [[ 0,  5,  0], [ 0,  5,  5], [ 5,  5,  5], [ 5,  5,  0]],
      [[ 0,  0,  5], [ 5,  0,  5], [ 5,  5,  5], [ 0,  5,  5]]
    ]

test('Intersection of two non-overlapping geometries is an empty geometry', t => { 
  const box1 = fromPolygonArray({}, box1Polygons)
  const box2 = fromPolygonArray({}, box2Polygons)
  const empty = fromPolygonArray({}, [])

  t.true(equals(intersection(box1, box2), empty))
})

test('Intersection of two face-touching geometries is an empty geometry', t => { 
  const box1 = fromPolygonArray({}, box1Polygons)
  const box3 = fromPolygonArray({}, box3Polygons)
  const empty = fromPolygonArray({}, [])

  t.true(equals(intersection(box1, box3), empty))
})

test('Intersection of two overlapping geometries is the intersecting geometry', t => { 
  const box1 = fromPolygonArray({}, box1Polygons)
  const box4 = fromPolygonArray({}, box4Polygons)
  const box1AndBox4Intersection = fromPolygonArray({}, box1AndBox4IntersectionPolygons)

  t.true(equals(intersection(box1, box4), box1AndBox4Intersection))
})
