const test = require('ava')
const {fromScalar, fromValues, fromVec2, toString} = require('./index')

test('vec3: fromScalar() should return a new vec3 with correct values', t => {
  const obs1 = fromScalar(0)
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.not(obs1, exp1)

  const obs2 = fromScalar(-5)
  const exp2 = fromValues(-5, -5, -5)
  t.deepEqual(obs2, exp2)
  t.not(obs2, exp2)
})

test('vec3: fromVec2() should return a new vec3 with correct values', t => {
  const obs1 = fromVec2([0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.not(obs1, exp1)

  const obs2 = fromVec2([0, 1], -5)
  const exp2 = fromValues(0, 1, -5)
  t.deepEqual(obs2, exp2)
  t.not(obs2, exp2)

  const str1 = toString(obs2)
})
