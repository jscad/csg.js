const test = require('ava')
const rewiremock = require('rewiremock').default

test('chainHull: Should hull expected pairs for open chain', t => {
  rewiremock('./hull').with((...args) => ['hull', ...args])
  rewiremock('./union').with((...args) => ['union', ...args])

  rewiremock.enable()
  const chainHull = require('./chainHull')
  const implicit = chainHull({}, 'a', 'b', 'c')
  const explicit = chainHull({ closed: false }, 'a', 'b', 'c')
  rewiremock.disable()

  // Demonstrate that the pairs are chained sequentially without closing.
  t.deepEqual(explicit, ['union', ['hull', 'a', 'b'],
    ['hull', 'b', 'c']])

  // Demonstrate that the default is an open chain.
  t.deepEqual(explicit, implicit)
})

test('chainHull: Should hull expected pairs for closed chain', t => {
  rewiremock('./hull').with((...args) => ['hull', ...args])
  rewiremock('./union').with((...args) => ['union', ...args])

  rewiremock.enable()
  const chainHull = require('./chainHull')
  const obs = chainHull({ closed: true }, 'a', 'b', 'c')
  rewiremock.disable()

  t.deepEqual(JSON.stringify(obs), '["union",["hull","a","b"],["hull","b","c"],["hull","c","a"]]')

  t.deepEqual(obs.length, 4)

  // Demonstrate that the pairs are chained sequentially with closing.
  // t.deepEqual(obs, ['union', ['hull', 'a', 'b'],
  //                            ['hull', 'b', 'c']
  //                            ['hull', 'c', 'a']]);
  // Why does the above give me the following?
  //     [
  //       'union',
  //       Array [ … ],
  //   -   Array [ … ],
  //   +   undefined,
  //   -   Array [ … ],
  //     ]
})
