const test = require('ava')

const {equals, fromPoints, toString} = require('./index')

test('equals: Two open paths with the same points are equal', t => {
  const p1 = fromPoints({ closed: false }, [[0, 0], [2, 0], [2, 1], [0, 1]])
  const p2 = fromPoints({ closed: false }, [[0, 0], [2, 0], [2, 1], [0, 1]])
  t.true(equals(p1, p2))
})

test('equals: Two open paths with the same points rotated are unequal', t => {
  t.false(equals(fromPoints({ closed: false }, [[0, 0], [2, 0], [2, 1], [0, 1]]),
                 fromPoints({ closed: false }, [[2, 0], [2, 1], [0, 1], [0, 0]])))
})

test('equals: Two closed paths with the same points are equal', t => {
  t.true(equals(fromPoints({ closed: true }, [[0, 0], [2, 0], [2, 1], [0, 1]]),
                fromPoints({ closed: true }, [[0, 0], [2, 0], [2, 1], [0, 1]])))
})

test('equals: Two closed paths with the same points rotated are equal', t => {
  t.true(equals(fromPoints({ closed: true }, [[0, 0], [2, 0], [2, 1], [0, 1]]),
                fromPoints({ closed: true }, [[2, 0], [2, 1], [0, 1], [0, 0]])))
})

test('equals: A closed path and an option path with the same points are unequal', t => {
  t.false(equals(fromPoints({ closed: true }, [[0, 0], [2, 0], [2, 1], [0, 1]]),
                 fromPoints({ closed: false }, [[0, 0], [2, 0], [2, 1], [0, 1]])))
})
