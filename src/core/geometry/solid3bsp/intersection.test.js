const create = require('./create')
const equals = require('./equals')
const fromPoly3Array = require('./fromPoly3Array')
const intersection = require('./intersection')
const test = require('ava')

test('geom3: intersection() of zero solids is empty solid', t => {
  t.true(equals(intersection(), create()))
})

test('geom3: intersection() of one solid is that solid', t => {
  const solid = create()
  t.is(intersection(solid), solid)
})

test('geom3: intersection() should create proper intersection from empty geometries', (t) => {
  // Test for one, two, and three solids.
  t.true(equals(intersection(create()), create()))
  t.true(equals(intersection(create(), create()), create()))
  t.true(equals(intersection(create(), create(), create()), create()))
})

test('geom3: intersection() should create proper intersection from solid geometries', (t) => {
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

  const obj1 = fromPoly3Array(box1)
  const obj2 = fromPoly3Array(box2)
  const obj3 = fromPoly3Array(box3)
  const obj4 = fromPoly3Array(box4)

  // one solid geometry
  const ret1 = intersection(obj1)
  const exp1 = fromPoly3Array(box1)
  t.true(equals(ret1, exp1))

  // two non-overlapping geometries
  const ret2 = intersection(obj1, obj2)
  const exp2 = fromPoly3Array([])
  exp2.isCanonicalized = true
  exp2.isRetesselated = true
  t.true(equals(ret2, exp2))

  // two touching geometries (faces)
  const ret3 = intersection(obj1, obj3)
  const exp3 = fromPoly3Array([])
  exp3.isCanonicalized = true
  exp3.isRetesselated = true
  t.true(equals(ret3, exp3))

  // two overlapping geometries
  const ret4 = intersection(obj1, obj4)
  const exp4 = fromPoly3Array(
    [
      [[0.0, 0.0, 0.0], [0.0, 0.0, 5.0], [0.0, 5.0, 5.0], [0.0, 5.0, 0.0]],
      [[0.0, 0.0, 0.0], [5.0, 0.0, 0.0], [5.0, 0.0, 5.0], [0.0, 0.0, 5.0]],
      [[0.0, 0.0, 0.0], [0.0, 5.0, 0.0], [5.0, 5.0, 0.0], [5.0, 0.0, 0.0]],
      [[5.0, 0.0, 0.0], [5.0, 5.0, 0.0], [5.0, 5.0, 5.0], [5.0, 0.0, 5.0]],
      [[0.0, 5.0, 0.0], [0.0, 5.0, 5.0], [5.0, 5.0, 5.0], [5.0, 5.0, 0.0]],
      [[0.0, 0.0, 5.0], [5.0, 0.0, 5.0], [5.0, 5.0, 5.0], [0.0, 5.0, 5.0]]
    ]
  )
  exp4.isCanonicalized = true
  exp4.isRetesselated = true
  t.true(equals(ret4, exp4))
})
