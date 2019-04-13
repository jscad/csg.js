const test = require('ava')

const {create} = require('./index')

test('create: Creates an empty, uncanonicalized geom2', t => {
  const expected = {baseSides: [], sides: [],
                    isCanonicalized: false, transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) }
  return t.deepEqual(create(), expected)
})

test('create: Creates a populated, uncanonicalized geom2', t => {
  const sides = [[0,0],[1,1]]
  const expected = {baseSides: sides, sides: [],
                    isCanonicalized : false, transforms: new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]) }
  return t.deepEqual(create(sides), expected)
})
