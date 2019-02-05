const appendPoint = require('./appendPoint')
const equals = require('./equals')
const fromPointArray = require('./fromPointArray')
const test = require('ava')

test('appendPoint: An empty path with a point appended is the same as a path created from that point', t => {
  const empty = fromPointArray({}, [])
  const origin = fromPointArray({}, [[0, 0]])
  t.true(equals(appendPoint(empty, [0, 0]), origin))
})

test('appendPoint: Appending to a closed path fails', t => {
  t.throws(() => appendPoint(fromPointArray({ closed: true }, []), [1, 1]),
           'Cannot append to closed path')
})

test('appendPoint: Can append multiple points.', t => {
  t.true(equals(appendPoint(fromPointArray({}, []), [0, 0], [1, 1]),
                fromPointArray({}, [[0, 0], [1, 1]])))
})
