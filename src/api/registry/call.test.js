const call = require('./call')
const test = require('ava')

const module = { twice: x => x * 2 }
const object = { __jscadTag__: 'tag' }

test('We can call through call', t => {
  t.is(call(object, module).twice(2), 4)
  t.is(call(object).twice(3), 6)
})

test('call is idempotent', t => {
  t.is(call(object, module), module)
  t.is(call(object), module)
})

test('call defaults to a consistent null module', t => {
  t.is(call({ __jscadTag__: 'other'}), call({ __jscadTag__: 'else' }))
})
