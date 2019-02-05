const canonicalize = require('./canonicalize')
const equals = require('./equals')
const fromValues = require('./fromValues')
const spatialResolution = require('../../constants').spatialResolution
const test = require('ava')

const piVec = fromValues(Math.PI, Math.PI);

test('vec2: Canonicalizion is transformative', t => {
  t.false(equals(piVec, canonicalize(piVec)));
})

test('vec2: Canonicalizion is idemponent', t => {
  t.true(equals(canonicalize(piVec), canonicalize(canonicalize(piVec))));
})
