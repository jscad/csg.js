const test = require('ava')

const { rgbToHsl } = require('./index')

test('rgbToHsl', t => {
  let obs = rgbToHsl(1, 0, 0.5)
  let exp = [0.9166666666666666, 1, 0.5]

  t.deepEqual(obs, exp)

  obs = rgbToHsl([1, 0, 0.5])
  exp = [0.9166666666666666, 1, 0.5]

  t.deepEqual(obs, exp)

  obs = rgbToHsl([0.5, 0.5, 0.5])
  exp = [0, 0, 0.5]

  t.deepEqual(obs, exp)
})
