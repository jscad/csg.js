const test = require('ava')
const { create, fromPoints } = require('./index')
const mat4 = require('../../math/mat4')

test('shape2: create() should return an empty shape2', t => {
  const obs = create()
  const exp = {
    type: 'shape2',
    sides: [], // not sure if sides or curves will be kept (either or)
    curves: [], // not sure if sides or curves will be kept (either or)
    isCanonicalized: false,

    transforms: mat4.identiy(),
    negative: false
  }
  t.deepEqual(obs, exp)
})

test('shape2: fromPoints() should create a shape2 from points', t => {
  const points = [
    [-13, -13],
    [13, -13],
    [13, 13]
  ]
  const obs = fromPoints(points)
  const exp = {
    type: 'shape2',
    sides: [],
    curves: [],
    isCanonicalized: false,

    transforms: mat4.identiy(),
    negative: false
  }
  t.deepEqual(obs, exp)
})
