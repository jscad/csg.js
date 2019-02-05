const appendPoint = require('./appendPoint')
const canonicalize = require('./appendPoint')
const equals = require('./equals')
const fromPointArray = require('./fromPointArray')
const test = require('ava')

test('canonicalize: An empty path is canonical', t => {
  t.true(fromPointArray({}, []).isCanonicalized);
})

test('canonicalize: A non-empty path is not canonical on creation', t => {
  t.false(fromPointArray({}, [[0, 0]]).isCanonicalized);
})

test('canonicalize: A canonicalized path is canonical', t => {
  t.true(canonicalize(fromPointArray({}, [[0, 0]])).isCanonicalized);
})

test('canonicalize: Appending to a canonicalized produces a non-canonical path', t => {
  t.true(appendPoint(canonicalize(fromPointArray({}, [[0, 0]])).isCanonicalized);
})

test('appendPoint: Appending to a closed path fails', async t => {
  t.throws(() => appendPoint(fromPointArray({ closed: true }, []), [1, 1]),
           'Cannot append to closed path')
})

test('appendPoint: Can append multiple points.', t => {
  t.true(equals(appendPoint(fromPointArray({}, []), [0, 0], [1, 1]),
                fromPointArray({}, [[0, 0], [1, 1]])))
})
