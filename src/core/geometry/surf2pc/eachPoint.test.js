const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const eachPoint = require('./eachPoint')

const polygon = [[0, 1], [0, 0], [2, 0], [2, 1]]

test('eachPoint: Emits the contained points', t => {
  const collected = []
  eachPoint({},
            point => collected.push(point),
            fromPolygonArray({}, [polygon]))
  t.deepEqual(collected, polygon)
})
