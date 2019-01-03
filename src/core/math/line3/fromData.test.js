const test = require('ava')
const { fromData } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line3: fromData() should return a new line3 with correct values', (t) => {
  let obs = fromData([0, 0, 0], [1, 0, 0])
  let pnt = obs[0]
  let dir = obs[1]
  t.true(compareVectors(pnt, [0, 0, 0]))
  t.true(compareVectors(dir, [1, 0, 0]))

  obs = fromData([1, 0, 0], [0, 2, 0])
  pnt = obs[0]
  dir = obs[1]
  t.true(compareVectors(pnt, [1, 0, 0]))
  t.true(compareVectors(dir, [0, 1, 0]))

  obs = fromData([0, 1, 0], [3, 0, 0])
  pnt = obs[0]
  dir = obs[1]
  t.true(compareVectors(pnt, [0, 1, 0]))
  t.true(compareVectors(dir, [1, 0, 0]))

  obs = fromData([0, 0, 1], [0, 0, 4])
  pnt = obs[0]
  dir = obs[1]
  t.true(compareVectors(pnt, [0, 0, 1]))
  t.true(compareVectors(dir, [0, 0, 1]))

  // line3 created from a bad direction results in an invalid line3
  obs = fromData([0, 5, 0], [0, 0, 0])
  pnt = obs[0]
  dir = obs[1]
  t.true(compareVectors(pnt, [0, 5, 0]))
  t.true(compareVectors(dir, [NaN, NaN, NaN]))
})
