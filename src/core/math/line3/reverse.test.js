const test = require('ava')
const { reverse, create, fromPoints } = require('./index')

const { compareVectors } = require('../../../../test/helpers/index')

test.only('line3: reverse() should return proper lines', (t) => {
  const line1 = create()
  let rev = reverse(line1)
  let pnt = rev[0]
  let dir = rev[1]
  t.true(compareVectors(pnt, [0, 0, 0]))
  t.true(compareVectors(dir, [0, 0, -1]))

  const line2 = fromPoints([1, 0, 0], [0, 1, 0])
  rev = reverse(line2)
  pnt = rev[0]
  dir = rev[1]
  t.true(compareVectors(pnt, [1, 0, 0]))
  t.true(compareVectors(dir, [0.7071067690849304, -0.7071067690849304, 0]))

  const line3 = fromPoints([0, 1, 0], [1, 0, 0])
  rev = reverse(line3)
  pnt = rev[0]
  dir = rev[1]
  t.true(compareVectors(pnt, [0, 1, 0]))
  t.true(compareVectors(dir, [-0.7071067690849304, 0.7071067690849304, 0]))

  const line4 = fromPoints([0, 6, 0], [0, 0, 6])
  rev = reverse(line4)
  pnt = rev[0]
  dir = rev[1]
  t.true(compareVectors(pnt, [0, 6, 0]))
  t.true(compareVectors(dir, [0, 0.7071067690849304, -0.7071067690849304]))

  const line5 = fromPoints([-5, 5, 5], [5, -5, -5])
  rev = reverse(line5)
  pnt = rev[0]
  dir = rev[1]
  t.true(compareVectors(pnt, [-5, 5, 5]))
  t.true(compareVectors(dir, [-0.5773502588272095, 0.5773502588272095, 0.5773502588272095]))
})

test('line3: reverse() called with two paramerters should update a line3 with proper values', (t) => {
  const line1 = create()
  const obs1 = create()
  const ret1 = reverse(obs1, line1)
  t.true(compareVectors(ret1, [0, -1, 0]))
  t.true(compareVectors(obs1, [0, -1, 0]))

  const line2 = fromPoints([1, 0], [0, 1])
  const obs2 = create()
  const ret2 = reverse(obs2, line2)
  t.true(compareVectors(ret2, [0.7071067690849304, 0.7071067690849304, 0.7071067690849304]))
  t.true(compareVectors(obs2, [0.7071067690849304, 0.7071067690849304, 0.7071067690849304]))

  const line3 = fromPoints([0, 1], [1, 0])
  const obs3 = create()
  const ret3 = reverse(obs3, line3)
  t.true(compareVectors(ret3, [-0.7071067690849304, -0.7071067690849304, -0.7071067690849304]))
  t.true(compareVectors(obs3, [-0.7071067690849304, -0.7071067690849304, -0.7071067690849304]))

  const line4 = fromPoints([0, 6], [6, 0])
  const obs4 = create()
  const ret4 = reverse(obs4, line4)
  t.true(compareVectors(ret4, [-0.7071067690849304, -0.7071067690849304, -4.242640495300293]))
  t.true(compareVectors(obs4, [-0.7071067690849304, -0.7071067690849304, -4.242640495300293]))

  const line5 = fromPoints([-5, 5], [5, -5])
  const obs5 = create()
  const ret5 = reverse(obs5, line5)
  t.true(compareVectors(ret5, [-0.7071067690849304, -0.7071067690849304, 0]))
  t.true(compareVectors(obs5, [-0.7071067690849304, -0.7071067690849304, 0]))
})

