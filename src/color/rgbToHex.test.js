const test = require('ava')

const { rgbToHex } = require('./index')

test('rgbToHex', t => {
  let obs = rgbToHex(1, 0, 0.5)
  let exp = '#ff007f'

  t.deepEqual(obs, exp)

  obs = rgbToHex([1, 0, 0.5])
  exp = '#ff007f'

  t.deepEqual(obs, exp)
})
