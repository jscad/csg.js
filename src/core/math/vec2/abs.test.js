const test = require('ava')
const {abs, fromValues} = require('./index')

test('vec2: abs() should return a vec2 with positive values', t => {
  const obs1 = abs([0, 0])
  const exp1 = fromValues(0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = abs([1, 2])
  const exp2 = fromValues(1, 2)
  t.deepEqual(obs2, exp2)

  const obs3 = abs([-1, -2])
  const exp3 = fromValues(1, 2)
  t.deepEqual(obs3, exp3)
})
