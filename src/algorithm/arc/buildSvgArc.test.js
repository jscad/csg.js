const buildSvgArc = require('./buildSvgArc')
const test = require('ava')
const vec2 = require('../../math/vec2')

// TODO: More comprehensive test cases.

test('Flat arc', t => {
  t.deepEqual(buildSvgArc({}, [0, 0], [1, 1]).map(p => [...p]),
              [[0, 0], [1, 1]])
})

test('Half circle, small arc', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: false, xRadius: 0.5, yRadius: 0.5 }, [1, 1], [2, 2]).map(p => [...p]),
              [[1, 1],
               [1.499559998512268, 0.7943999767303467],
               [1.9984899759292603, 1.0015100240707397],
               [2.2056000232696533, 1.500440001487732],
               [2, 2]])
})

test('Half circle, large arc', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: true, xRadius: 0.5, yRadius: 0.5 }, [1, 1], [2, 2]).map(p => [...p]),
              [[1, 1],
               [1.3896299600601196, 0.8002899885177612],
               [1.8221499919891357, 0.8682600259780884],
               [2.131740093231201, 1.1778500080108643],
               [2.199709892272949, 1.6103700399398804],
               [2, 2]])
})

test('Quarter circle', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: false, xRadius: 1, yRadius: 1 }, [1, 1], [2, 2]).map(p => [...p]),
              [[1, 1],
               [1.5, 1.133970022201538],
               [1.866029977798462, 1.5],
               [2, 2]])
})

test('Three-quarter circle', t => {
  t.deepEqual(buildSvgArc({ resolution: 6, large: true, xRadius: 1, yRadius: 1 }, [1, 1], [2, 2]).map(p => [...p]),
              [[1, 1],
               [1.292889952659607, 0.2928900122642517],
               [2, 0],
               [2.7071099281311035, 0.2928900122642517],
               [3, 1],
               [2.7071099281311035, 1.707110047340393],
               [2, 2]])
})
