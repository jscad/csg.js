const test = require('ava')

const { flip, fromPoints } = require('./index')

const equals = require('./equals')

test('poly3: flip() should return a new poly3 with correct values', (t) => {
  const exp1 = [[1, 1, 0], [1, 0, 0], [0, 0, 0]]; exp1.plane = [0, 0, -1, 0]
  const org1 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret1 = flip(org1)
  t.true(equals(ret1, exp1))

  const exp2 = [[0, 0, 0], [1, 0, 0], [1, 1, 0]]; exp2.plane = [0, 0, 1, 0]
  const org2 = fromPoints([[1, 1, 0], [1, 0, 0], [0, 0, 0]])
  const ret2 = flip(org2)
  t.true(equals(ret2, exp2))
})
