const test = require('ava')
const { rotateX, identity , toString } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('mat4: rotateX() should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295

  const idn = identity()

  const obs2 = rotateX(rotation, idn)
  t.true(compareVectors(obs2, [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]))

  const obs3 = rotateX(-rotation, idn)
  t.true(compareVectors(obs3, [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]))
})

test('mat4: rotateX() called with out parameter should return a new mat4 with correct values', (t) => {
  let rotation = 90 * 0.017453292519943295

  const idn = identity()

  const mat2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const ret2 = rotateX(mat2, rotation, idn)
  t.true(compareVectors(mat2, [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]))
  t.true(compareVectors(ret2, [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]))
  t.is(mat2, ret2)

  const mat3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  const ret3 = rotateX(mat3, -rotation, idn)
  t.true(compareVectors(mat3, [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]))
  t.true(compareVectors(ret3, [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]))
})
