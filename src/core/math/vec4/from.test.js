const test = require('ava')
const {fromScalar, fromValues, toString} = require('./index')

test('vec4: fromScalar() should return a new vec4 with correct values', t => {
  const obs1 = fromScalar(0)
  const exp1 = fromValues(0, 0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.not(obs1, exp1)

  const obs2 = fromScalar(-5)
  const exp2 = fromValues(-5, -5, -5, -5)
  t.deepEqual(obs2, exp2)
  t.not(obs2, exp2)

  const str1 = toString(obs2)
})
