const canonicalize = require('./canonicalize')
const equals = require('./equals')
const fromValues = require('./fromValues')
const quantizeForSpace = require('../utils/quantizeForSpace')
const test = require('ava')

const pi = 3.141592653589793
const piQuantized = quantizeForSpace(pi)

const piVec = fromValues(pi, pi, pi)

// This test is intended to be illustrative, and establish ground truth
// It will need to be updated if ../../constants.spatialResolution changes.
test('vec3: Canonicalization quantizes to spatial resolution', t => {
  t.true(equals(canonicalize(piVec),
                fromValues(piQuantized, piQuantized, piQuantized)))
})

test('vec3: Canonicalization is transformative', t => {
  t.false(equals(piVec, canonicalize(piVec)));
})

test('vec3: Canonicalization is idempotent', t => {
  t.true(equals(canonicalize(piVec), canonicalize(canonicalize(piVec))));
})

test('vec3: Canonicalization of a vec2 results in a vec3 with z = 0', t => {
  t.true(equals(canonicalize([pi, pi]),
                fromValues(piQuantized, piQuantized, 0)))
})
