const test = require('ava')
const { reverse, create, fromPoints } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test('line2: reverse() should return proper lines', (t) => {
  const line1 = create()
  const rev1 = reverse(line1)
  t.true(compareVectors(rev1, [0, -1, 0]))

  const line2 = fromPoints([1, 0], [0, 1])
  const rev2 = reverse(line2)
  t.true(compareVectors(rev2, [0.7071067690849304, 0.7071067690849304, 0.7071067690849304]))

  const line3 = fromPoints([0, 1], [1, 0])
  const rev3 = reverse(line3)
  t.true(compareVectors(rev3, [-0.7071067690849304, -0.7071067690849304, -0.7071067690849304]))

  const line4 = fromPoints([0, 6], [6, 0])
  const rev4 = reverse(line4)
  t.true(compareVectors(rev4, [-0.7071067690849304, -0.7071067690849304, -4.242640495300293]))

  const line5 = fromPoints([-5, 5], [5, -5])
  const rev5 = reverse(line5)
  t.true(compareVectors(rev5, [-0.7071067690849304, -0.7071067690849304, 0]))
})
