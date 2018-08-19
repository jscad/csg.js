const test = require('ava')
const {fromAngle, fromAngleDegrees, fromAngleRadians, fromScalar, fromValues, toString} = require('./index')

test('vec2: fromScalar() should return a new vec2 with correct values', t => {
  const obs1 = fromScalar(0)
  const exp1 = fromValues(0, 0)
  t.deepEqual(obs1, exp1)
  t.not(obs1, exp1)

  const obs2 = fromScalar(-5)
  const exp2 = fromValues(-5, -5)
  t.deepEqual(obs2, exp2)
  t.not(obs2, exp2)

  const str = toString(obs2)
})
