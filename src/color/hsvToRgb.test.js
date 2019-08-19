const test = require('ava')

const { hsvToRgb } = require('./index')

test('hsvToRgb', t => {
  let obs = hsvToRgb(0, 0.2, 0)
  let exp = [0, 0, 0]

  t.deepEqual(obs, exp)

  obs = hsvToRgb([0, 0.2, 0])
  exp = [0, 0, 0]

  t.deepEqual(obs, exp)

  obs = hsvToRgb([0.9166666666666666, 1, 1])
  exp = [1, 0, 0.5]

  t.deepEqual(obs, exp)
})
