const registerImplementation = require('./registerImplementation')
const test = require('ava')

test('registerImplementation is idempotent', t => {
  const tag = 'tag'
  const module1 = {}
  const module2 = {}

  t.is(registerImplementation(tag, module1), module1)
  t.is(registerImplementation(tag, module2), module1)
})
