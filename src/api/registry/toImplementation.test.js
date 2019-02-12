const toImplementation = require('./toImplementation')
const registerImplementation = require('./registerImplementation')
const test = require('ava')

test('toImplementation is idempotent', t => {
  const tag = 'tag'
  const module = {}
  const object = { __jscadTag__: tag }

  t.is(registerImplementation(tag, module), module)
  t.is(toImplementation(object), module)
})

test('implementationOf defaults to a consistent null module', t => {
  const module = toImplementation({ __jscadTag__: 'tag_1' })

  t.is(toImplementation({ __jscadTag__: 'tag_2'}), module)
})
