const close = require('./close')
const fromPointArray = require('./fromPointArray')
const test = require('ava')

test('Open path is not closed.', t => {
  t.false(fromPointArray({}, []).isClosed)
})

test('Closed path is closed.', t => {
  t.true(close(fromPointArray({}, [])).isClosed)
})
