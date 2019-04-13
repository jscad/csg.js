const test = require('ava')

const concat = require('./concat')
const canonicalize = require('./canonicalize')
const fromPoints = require('./fromPoints')

test('canonicalize: An empty path is non-canonical on creation', t => {
  t.false(fromPoints({}, []).isCanonicalized)
})

test('canonicalize: A non-empty path is not canonical on creation', t => {
  t.false(fromPoints({}, [[0, 0, 0]]).isCanonicalized)
})

test('canonicalize: A canonicalized path is canonical', t => {
  t.true(canonicalize(fromPoints({}, [[0, 0, 0]])).isCanonicalized)
})

test('canonicalize: Concating to a canonicalized path produces a non-canonical path', t => {
  t.false(concat(canonicalize(fromPoints({}, [[0, 0, 0]])),
                 fromPoints({}, [1,1,1]))
              .isCanonicalized)
})
