const test = require('ava')

const { rgbToHsv } = require('./index')

test('rgbToHsv', t => {
  let obs = rgbToHsv(1, 0, 0.5)
  let exp = [0.9166666666666666, 1, 1]

  t.deepEqual(obs, exp)

  obs = rgbToHsv([1, 0, 0.5])
  exp = [0.9166666666666666, 1, 1]

  t.deepEqual(obs, exp)

  obs = rgbToHsv([0.5, 0.5, 0.5])
  exp = [0, 0, 0.5]

  t.deepEqual(obs, exp)
})
