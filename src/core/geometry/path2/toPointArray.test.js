const fromPointArray = require('./fromPointArray')
const toPointArray = require('./toPointArray')
const test = require('ava')
const vec2 = require('../../math/vec2')

test('toPointArray: An empty path produces an empty point array', t => {
  t.deepEqual(toPointArray({}, fromPointArray({}, [])), [])
})

test('toPointArray: An non-empty open path produces a matching point array', t => {
  t.deepEqual(toPointArray({}, fromPointArray({}, [[1, 1]])), [vec2.fromValues(1, 1)])
})

test('toPointArray: An non-empty closed path produces a matching point array', t => {
  t.deepEqual(toPointArray({}, fromPointArray({}, [[1, 1]])), [vec2.fromValues(1, 1)])
})
