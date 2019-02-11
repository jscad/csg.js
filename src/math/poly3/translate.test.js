const test = require('ava')

const { translate, fromPoints } = require('./index')

const equals = require('./equals')

test('poly3: translate() should return a new poly3 with correct values', (t) => {
  const exp1 = [[1, 3, 5], [2, 3, 5], [2, 4, 5]]; exp1.plane = [0, 0, 1, 5]
  const org1 = fromPoints([[0, 0, 0], [1, 0, 0], [1, 1, 0]])
  const ret1 = translate([1, 3, 5], org1)
  t.true(equals(ret1, exp1))

  const exp2 = [[-4, 7, -15], [-4, 6, -15], [-5, 6, -15]]; exp2.plane = [0, 0, -1, 15]
  const org2 = fromPoints([[1, 1, 0], [1, 0, 0], [0, 0, 0]])
  const ret2 = translate([-5, 6, -15], org2)
  t.true(equals(ret2, exp2))
})
