const test = require('ava')
const { create, clone, fromPoints } = require('./index')

const equals = require('./equals')

test('poly3: clone() should return a new poly3 with same values', (t) => {
  const org1 = create()
  const ret1 = clone(org1)
  t.true(equals(ret1, org1))
  t.not(ret1, org1)

  const org2 = fromPoints([[1, 1, 0], [-1, 1, 0], [-1, -1, 0], [1, -1, 0]])
  const ret2 = clone(org2)
  t.true(equals(ret2, org2))
  t.not(ret2, org2)
})
