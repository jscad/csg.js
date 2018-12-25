const test = require('ava')
const { intersectToLine, create, fromPoints } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line2: intersectToLine() should return proper points', (t) => {
  const line1 = create()

  const line2 = fromPoints([1, 0], [0, 1])
  const int2 = intersectToLine(line1, line2)
  t.true(compareVectors(int2, [1, 0]))

  // same lines opposite directions
  const line3 = fromPoints([0, 1], [1, 0])
  const int3 = intersectToLine(line3, line2)
  t.true(compareVectors(int3, [NaN, NaN]))

  // paralell lines
  const line4 = fromPoints([0, 6], [6, 0])
  const int4 = intersectToLine(line4, line3)
  t.true(compareVectors(int4, [Infinity, -Infinity]))

  // intersecting lines
  const line5 = fromPoints([0, -6], [6, 0])
  const int5 = intersectToLine(line5, line4)
  t.true(compareVectors(int5, [6, 0]))

  const line6 = fromPoints([-6, 0], [0, -6])
  const int6 = intersectToLine(line6, line5)
  t.true(compareVectors(int6, [0, -6]))
})
