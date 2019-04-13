const test = require('ava')

const vec2 = require('../../math/vec2')

const fromPoints = require('./fromPoints')
const eachPoint = require('./eachPoint')

test('eachPoint: Each point is emitted', t => {
  const collector = []
  eachPoint({},
            point => collector.push(point),
            fromPoints({}, [[1, 1, 0], [2, 2, 0]]))
  t.deepEqual(collector, [vec2.fromValues(1, 1), vec2.fromValues(2, 2)])
})
