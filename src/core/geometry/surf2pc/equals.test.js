const equals = require('./equals')
const flip = require('./flip')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const transform = require('./transform')

const X = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])
const rotatedX = fromPolygonArray({}, [[[0, 0], [2, 0], [2, 1], [0, 1]]])
const swappedX = fromPolygonArray({}, [[[0, 1], [2, 0], [0, 0], [2, 1]]])

test('equals: polygon equals that polygon', t => {
  t.true(equals(X, X))
})

test('equals: polygon does not equals that polygon flipped', t => {
  t.false(equals(X, flip(X)))
})

test('equals: polygon equals that polygon with rotated points', t => {
  t.true(equals(X, rotatedX))
})

test('equals: polygon does not equal that polygon with swapped points', t => {
  t.false(equals(X, swappedX))
})

const rectangle = [[0, 1], [0, 0], [2, 0], [2, 1]]
const triangle = [[3, 3], [3, 2], [2, 2]]

const Y = fromPolygonArray({}, [rectangle, triangle])
const rotatedY = fromPolygonArray({}, [triangle, rectangle])

test('equals: polygon list equals that polygon list', t => {
  t.true(equals(Y, Y))
})

// TODO: These should really be equal.
test('equals: polygon list does not equal that polygon list rotated', t => {
  t.false(equals(Y, rotatedY))
})
