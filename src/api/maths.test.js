const test = require('ava')
const { gcd, lcm, lookup } = require('./maths')

test('lookup', t => {
  const values = [
    [ -200, 5 ],
    [ -50, 20 ],
    [ -20, 18 ],
    [ +80, 25 ],
    [ +150, 2 ]]

  const obs1 = lookup(2, values)
  const obs2 = lookup(4.2, values)
  const obs3 = lookup(20, values)

  t.deepEqual(obs1, 19.54)
  t.deepEqual(obs2, 19.694)
  t.deepEqual(obs3, 20.799999999999997)
})

test('gcd', t => {
  const cases = [
    [1, 8, 1],
    [2, 8, 2],
    [3, 5, 1],
    [15, 25, 5],
  ]
  for (var c of cases) {
    t.is(gcd(c[0], c[1]), c[2])
    t.is(gcd(c[1], c[0]), c[2])
  }
})

test('lcm', t => {
  const cases = [
    [1, 8, 8],
    [2, 8, 8],
    [3, 5, 15],
    [15, 25, 75],
  ]
  for (var c of cases) {
    t.is(lcm(c[0], c[1]), c[2], c)
    t.is(lcm(c[1], c[0]), c[2], c)
  }
})

