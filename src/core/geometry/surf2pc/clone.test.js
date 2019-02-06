const clone = require('./clone')
const equals = require('./equals')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')

const rectangle = fromPolygonArray({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]])

test('clone: Clones are initially equal', t => {
  t.true(equals(rectangle, clone(rectangle)))
})

test('clone: Clones are distinct', t => {
  t.not(rectangle, clone(rectangle))
})
