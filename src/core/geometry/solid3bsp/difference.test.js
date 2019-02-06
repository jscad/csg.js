const create = require('./create')
const difference = require('./difference')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')

if (false) // good
test('difference: Difference of zero solids is empty solid', t => {
  t.true(equals(difference(), fromPolygonArray({}, [])))
})

if (false) // good
test('difference: Difference of one solid is that solid', t => {
  const solid = create()
  const differenced = difference(solid)
  t.true(equals(solid, differenced))
})

test('geom3: difference() should create proper empty geometries from empty geometries', (t) => {
  // Test for one, two and three.
  t.true(equals(create(), difference(create())))
  t.true(equals(create(), difference(create(), create())))
  t.true(equals(create(), difference(create(), create(), create())))
})

if (false)
test('geom3: difference() should create proper geometries from solid geometries', (t) => {
  const box1 = [
    [[-5.0, -5.0, -5.0], [-5.0, -5.0, 5.0], [-5.0, 5.0, 5.0], [-5.0, 5.0, -5.0]],
    [[5.0, -5.0, -5.0], [5.0, 5.0, -5.0], [5.0, 5.0, 5.0], [5.0, -5.0, 5.0]],
    [[-5.0, -5.0, -5.0], [5.0, -5.0, -5.0], [5.0, -5.0, 5.0], [-5.0, -5.0, 5.0]],
    [[-5.0, 5.0, -5.0], [-5.0, 5.0, 5.0], [5.0, 5.0, 5.0], [5.0, 5.0, -5.0]],
    [[-5.0, -5.0, -5.0], [-5.0, 5.0, -5.0], [5.0, 5.0, -5.0], [5.0, -5.0, -5.0]],
    [[-5.0, -5.0, 5.0], [5.0, -5.0, 5.0], [5.0, 5.0, 5.0], [-5.0, 5.0, 5.0]]
  ]

  const box2 = [
    [[15.0, 15.0, 15.0], [15.0, 15.0, 25.0], [15.0, 25.0, 25.0], [15.0, 25.0, 15.0]],
    [[25.0, 15.0, 15.0], [25.0, 25.0, 15.0], [25.0, 25.0, 25.0], [25.0, 15.0, 25.0]],
    [[15.0, 15.0, 15.0], [25.0, 15.0, 15.0], [25.0, 15.0, 25.0], [15.0, 15.0, 25.0]],
    [[15.0, 25.0, 15.0], [15.0, 25.0, 25.0], [25.0, 25.0, 25.0], [25.0, 25.0, 15.0]],
    [[15.0, 15.0, 15.0], [15.0, 25.0, 15.0], [25.0, 25.0, 15.0], [25.0, 15.0, 15.0]],
    [[15.0, 15.0, 25.0], [25.0, 15.0, 25.0], [25.0, 25.0, 25.0], [15.0, 25.0, 25.0]]
  ]

  const box3 = [
    [[-5.0, -5.0, 5.0], [-5.0, -5.0, 15.0], [-5.0, 5.0, 15.0], [-5.0, 5.0, 5.0]],
    [[5.0, -5.0, 5.0], [5.0, 5.0, 5.0], [5.0, 5.0, 15.0], [5.0, -5.0, 15.0]],
    [[-5.0, -5.0, 5.0], [5.0, -5.0, 5.0], [5.0, -5.0, 15.0], [-5.0, -5.0, 15.0]],
    [[-5.0, 5.0, 5.0], [-5.0, 5.0, 15.0], [5.0, 5.0, 15.0], [5.0, 5.0, 5.0]],
    [[-5.0, -5.0, 5.0], [-5.0, 5.0, 5.0], [5.0, 5.0, 5.0], [5.0, -5.0, 5.0]],
    [[-5.0, -5.0, 15.0], [5.0, -5.0, 15.0], [5.0, 5.0, 15.0], [-5.0, 5.0, 15.0]]
  ]

  const box4 = [
    [[0.0, 0.0, 0.0], [0.0, 0.0, 10.0], [0.0, 10.0, 10.0], [0.0, 10.0, 0.0]],
    [[10.0, 0.0, 0.0], [10.0, 10.0, 0.0], [10.0, 10.0, 10.0], [10.0, 0.0, 10.0]],
    [[0.0, 0.0, 0.0], [10.0, 0.0, 0.0], [10.0, 0.0, 10.0], [0.0, 0.0, 10.0]],
    [[0.0, 10.0, 0.0], [0.0, 10.0, 10.0], [10.0, 10.0, 10.0], [10.0, 10.0, 0.0]],
    [[0.0, 0.0, 0.0], [0.0, 10.0, 0.0], [10.0, 10.0, 0.0], [10.0, 0.0, 0.0]],
    [[0.0, 0.0, 10.0], [10.0, 0.0, 10.0], [10.0, 10.0, 10.0], [0.0, 10.0, 10.0]]
  ]

  const obj1 = fromPolygonArray(box1)
  const obj2 = fromPolygonArray(box2)
  const obj3 = fromPolygonArray(box3)
  const obj4 = fromPolygonArray(box4)

  // one solid geometry
  const ret1 = difference(obj1)
  const exp1 = fromPolygonArray(box1)
  t.deepEqual(ret1, exp1)

  // two non-overlapping geometries
  const ret2 = difference(obj1, obj2)
  const exp2 = fromPolygonArray(box1)
  exp2.isCanonicalized = true
  exp2.isRetesselated = true
  t.deepEqual(ret2, exp2)

  // two touching geometries (faces)
  const ret3 = difference(obj1, obj3)
  const exp3 = fromPolygonArray(box1)
  exp3.isCanonicalized = true
  exp3.isRetesselated = true
  t.deepEqual(ret3, exp3)

  // two overlapping geometries
  const ret4 = difference(obj1, obj4)
  const exp4 = fromPolygonArray(
    [
      [[-5.0, -5.0, -5.0], [-5.0, -5.0, 5.0], [-5.0, 5.0, 5.0], [-5.0, 5.0, -5.0]],
      [[-5.0, -5.0, -5.0], [5.0, -5.0, -5.0], [5.0, -5.0, 5.0], [-5.0, -5.0, 5.0]],
      [[-5.0, -5.0, -5.0], [-5.0, 5.0, -5.0], [5.0, 5.0, -5.0], [5.0, -5.0, -5.0]],
      [[0.0, 5.0, 0.0], [0.0, 5.0, 5.0], [0.0, 0.0, 5.0], [0.0, 0.0, 0.0]],
      [[0.0, 0.0, 5.0], [5.0, 0.0, 5.0], [5.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
      [[5.0, 0.0, 0.0], [5.0, 5.0, 0.0], [0.0, 5.0, 0.0], [0.0, 0.0, 0.0]],
      [[5.0, -5.0, -5.0], [5.0, 0.0, -5.0], [5.0, 0.0, 5.0], [5.0, -5.0, 5.0]],
      [[0.0, 5.0, -5.0], [-5.0, 5.0, -5.0], [-5.0, 5.0, 5.0], [0.0, 5.0, 5.0]],
      [[-5.0, -5.0, 5.0], [0.0, -5.0, 5.0], [0.0, 5.0, 5.0], [-5.0, 5.0, 5.0]],
      [[5.0, 0.0, 0.0], [5.0, 0.0, -5.0], [5.0, 5.0, -5.0], [5.0, 5.0, 0.0]],
      [[0.0, 5.0, -5.0], [0.0, 5.0, 0.0], [5.0, 5.0, 0.0], [5.0, 5.0, -5.0]],
      [[0.0, 0.0, 5.0], [0.0, -5.0, 5.0], [5.0, -5.0, 5.0], [5.0, 0.0, 5.0]]
    ]
  )
  exp4.isCanonicalized = true
  exp4.isRetesselated = true
  // TODO need special compare function t.deepEqual(ret4, exp4)
})
