const normalizePoint = require('./normalizePoint')
const test = require('ava')

test('normalizePoint: 1 dimensional points are an error', t => {
  t.throws(() => normalizePoint([1]),
           'Only 2 and 3 dimensional points are supported')
})

test('normalizePoint: 2 dimensional points receive a third dimension of 0', t => {
  t.deepEqual(normalizePoint([1, 2]), [1, 2, 0])
})

test('normalizePoint: 3 dimensional points are preserved', t => {
  t.deepEqual(normalizePoint([1, 2, 3]), [1, 2, 3])
})

test('normalizePoint: 4 dimensional points are an error', t => {
  t.throws(() => normalizePoint([1, 2, 3, 4]),
           'Only 2 and 3 dimensional points are supported')
})
