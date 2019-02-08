const getImplementation = require('./getImplementation')
const registerImplementation = require('./registerImplementation')
const test = require('ava')

test('implementationOf is idempotent', t => {
  const tag = 'tag'
  const module = {}
  const object = { __jscadTag__: tag }

  t.is(registerImplementation(tag, module), module)
  t.is(getImplementation(object), module)
})

test('implementationOf defaults to a consistent null module', t => {
  const module = getImplementation({ __jscadTag__: 'tag_1' })

  t.is(getImplementation({ __jscadTag__: 'tag_2'}), module)
})
