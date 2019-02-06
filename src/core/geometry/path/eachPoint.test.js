const fromPointArray = require('./fromPointArray')
const eachPoint = require('./eachPoint')
const test = require('ava')
const vec2 = require('../../math/vec2')

test('eachPoint: Each point is emitted', t => {
  const collector = []
  eachPoint(fromPointArray({}, [[1, 1], [2, 2]]), point => collector.push(point))
  t.deepEqual(collector, [vec2.fromValues(1, 1), vec2.fromValues(2, 2)])
})
