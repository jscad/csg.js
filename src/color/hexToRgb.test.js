const test = require('ava')

const { hexToRgb } = require('./index')

test('hexToRgb', t => {
  let obs = hexToRgb()
  let exp = [0, 0, 0]

  t.deepEqual(obs, exp)

  obs = hexToRgb('bad')
  exp = [0, 0, 0]

  t.deepEqual(obs, exp)

  obs = hexToRgb('#ff007f')
  exp = [1, 0, 0.4980392156862745]

  t.deepEqual(obs, exp)
})
