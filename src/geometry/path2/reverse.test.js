const test = require('ava')

const equals = require('./equals')
const fromPoints = require('./fromPoints')
const reverse = require('./reverse')

test('reverse: The reverse of a path has reversed points', t => {
  const pointArray = [[0, 0], [1, 1]]
  t.false(equals(reverse(fromPoints({}, pointArray)),
                fromPoints({}, pointArray)))
})
