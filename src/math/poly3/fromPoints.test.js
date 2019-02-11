const test = require('ava')

const { fromPoints, toString } = require('./index')

const equals = require('./equals')

test('poly3: fromPoints() should return a new poly3 with correct values', (t) => {
  const exp1 = [[0, 0, 0], [1, 0, 0], [1, 1, 0]]; exp1.plane = [0, 0, 1, 0]
  const obs1 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  t.true(equals(obs1, exp1))

  const exp2 = [[1, 1, 0], [1, 0, 0], [0, 0, 0]]; exp2.plane = [0, 0, -1, 0]
  const obs2 = fromPoints([[1, 1, 0], [1, 0, 0], [0, 0, 0]]) // opposite orientation
  t.true(equals(obs2, exp2))

  const str1 = toString(obs1)
})
