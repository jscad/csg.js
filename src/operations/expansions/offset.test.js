const test = require('ava')

const {geom2, geom3, path2} = require('../../geometry')

const {offset} = require('./offset')

test('offset (options): offset of a path2 produces expected offset path2', t => {
  let openline = path2.fromPoints({}, [[0, 0], [5, 0], [0, 5]])
  let closeline = path2.fromPoints({}, [[0, 0], [5, 0], [0, 5], [0, 0]])

  // expand +
  let obs = offset({delta: 1}, openline)
  let pts = path2.toPoints(obs)
  let exp = [
    new Float32Array([ -6.123234262925839e-17, -1 ]),
    new Float32Array([ 5, -1 ]),
    new Float32Array([ 5.707106590270996, 0.7071067690849304 ]),
    new Float32Array([ 0.7071067690849304, 5.707106590270996 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: 1}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -6.123234262925839e-17, -1 ]),
    new Float32Array([ 5, -1 ]),
    new Float32Array([ 5.707106590270996, 0.7071067690849304 ]),
    new Float32Array([ 0.7071067690849304, 5.707106590270996 ]),
    new Float32Array([ -1, 5 ]),
    new Float32Array([ -1, 6.123234262925839e-17 ])
  ]
  t.deepEqual(pts, exp)

  // contract -
  obs = offset({delta: -1}, openline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ 6.123234262925839e-17, 1 ]),
    new Float32Array([ 2.5857865810394287, 1 ]),
    new Float32Array([ -0.7071067690849304, 4.292893409729004 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: -1}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ 1, 1 ]),
    new Float32Array([ 2.5857865810394287, 1 ]),
    new Float32Array([ 1, 2.5857865810394287 ])
  ]
  t.deepEqual(pts, exp)
})

test('offset (segments 1): offset of a path2 produces expected offset path2', t => {
  let openline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5]])
  let closeline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5], [-5, -5]])

  let obs = offset({delta: 1, segments: 1}, openline)
  let pts = path2.toPoints(obs)
  let exp = [
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 6, -6 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 6, 6 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2, 6 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2, 6 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: 1, segments: 1}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -6, -6 ]),
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 6, -6 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 6, 6 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2, 6 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2, 6 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ]),
    new Float32Array([ -6, 6 ]),
    new Float32Array([ -6, 5 ]),
    new Float32Array([ -6, -5 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: -0.5, segments: 1}, openline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -5, -4.5 ]),
    new Float32Array([ 4.5, -4.5 ]),
    new Float32Array([ 4.5, 4.5 ]),
    new Float32Array([ 3.5, 4.5 ]),
    new Float32Array([ 3.5, -3.0616171314629196e-17 ]),
    new Float32Array([ 3.5, -0.5 ]),
    new Float32Array([ 3, -0.5 ]),
    new Float32Array([ -3, -0.5 ]),
    new Float32Array([ -3.5, -0.5 ]),
    new Float32Array([ -3.5, 3.0616171314629196e-17 ]),
    new Float32Array([ -3.5, 4.5 ]),
    new Float32Array([ -5, 4.5 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: -0.5, segments: 1}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -4.5, -4.5 ]),
    new Float32Array([ 4.5, -4.5 ]),
    new Float32Array([ 4.5, 4.5 ]),
    new Float32Array([ 3.5, 4.5 ]),
    new Float32Array([ 3.5, -3.0616171314629196e-17 ]),
    new Float32Array([ 3.5, -0.5 ]),
    new Float32Array([ 3, -0.5 ]),
    new Float32Array([ -3, -0.5 ]),
    new Float32Array([ -3.5, -0.5 ]),
    new Float32Array([ -3.5, 3.0616171314629196e-17 ]),
    new Float32Array([ -3.5, 4.5 ]),
    new Float32Array([ -4.5, 4.5 ])
  ]
  t.deepEqual(pts, exp)
})

test('offset (segments 16): offset of a path2 produces expected offset path2', t => {
  let openline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5]])
  let closeline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5], [-5, -5]])

  let obs = offset({delta: 1, segments: 16}, openline)
  let pts = path2.toPoints(obs)
  let exp = [
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 5.382683277130127, -5.923879623413086 ]),
    new Float32Array([ 5.707106590270996, -5.707106590270996 ]),
    new Float32Array([ 5.923879623413086, -5.382683277130127 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 5.923879623413086, 5.382683277130127 ]),
    new Float32Array([ 5.707106590270996, 5.707106590270996 ]),
    new Float32Array([ 5.382683277130127, 5.923879623413086 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ 2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ 2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ -2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ -2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: 1, segments: 16}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -5.923879623413086, -5.382683277130127 ]),
    new Float32Array([ -5.707106590270996, -5.707106590270996 ]),
    new Float32Array([ -5.382683277130127, -5.923879623413086 ]),
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 5.382683277130127, -5.923879623413086 ]),
    new Float32Array([ 5.707106590270996, -5.707106590270996 ]),
    new Float32Array([ 5.923879623413086, -5.382683277130127 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 5.923879623413086, 5.382683277130127 ]),
    new Float32Array([ 5.707106590270996, 5.707106590270996 ]),
    new Float32Array([ 5.382683277130127, 5.923879623413086 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ 2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ 2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ -2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ -2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ]),
    new Float32Array([ -5.382683277130127, 5.923879623413086 ]),
    new Float32Array([ -5.707106590270996, 5.707106590270996 ]),
    new Float32Array([ -5.923879623413086, 5.382683277130127 ]),
    new Float32Array([ -6, 5 ]),
    new Float32Array([ -6, -5 ])
  ]
  t.deepEqual(pts, exp)
})

test('offset (segments 16): offset of a CW path2 produces expected offset path2', t => {
  let openline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5]].reverse())
  let closeline = path2.fromPoints({}, [[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5], [-5, -5]].reverse())

  let obs = offset({delta: -0.5, segments: 16}, openline)
  let pts = path2.toPoints(obs)
  let exp = [
    new Float32Array([ -5, 4.5 ]),
    new Float32Array([ -3.5, 4.5 ]),
    new Float32Array([ -3.5, 3.0616171314629196e-17 ]),
    new Float32Array([ -3.461939811706543, -0.19134171307086945 ]),
    new Float32Array([ -3.353553295135498, -0.3535533845424652 ]),
    new Float32Array([ -3.1913416385650635, -0.4619397521018982 ]),
    new Float32Array([ -3, -0.5 ]),
    new Float32Array([ 3, -0.5 ]),
    new Float32Array([ 3.1913416385650635, -0.4619397521018982 ]),
    new Float32Array([ 3.353553295135498, -0.3535533845424652 ]),
    new Float32Array([ 3.461939811706543, -0.19134171307086945 ]),
    new Float32Array([ 3.5, -3.0616171314629196e-17 ]),
    new Float32Array([ 3.5, 4.5 ]),
    new Float32Array([ 4.5, 4.5 ]),
    new Float32Array([ 4.5, -4.5 ]),
    new Float32Array([ -5, -4.5 ])
  ]
  t.deepEqual(pts, exp)

  obs = offset({delta: 1, segments: 16}, closeline)
  pts = path2.toPoints(obs)
  exp = [
    new Float32Array([ -5.382683277130127, -5.923879623413086 ]),
    new Float32Array([ -5.707106590270996, -5.707106590270996 ]),
    new Float32Array([ -5.923879623413086, -5.382683277130127 ]),
    new Float32Array([ -6, -5 ]),
    new Float32Array([ -6, 5 ]),
    new Float32Array([ -5.923879623413086, 5.382683277130127 ]),
    new Float32Array([ -5.707106590270996, 5.707106590270996 ]),
    new Float32Array([ -5.382683277130127, 5.923879623413086 ]),
    new Float32Array([ -5, 6 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ -2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ -2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2.076120376586914, 5.382683277130127 ]),
    new Float32Array([ 2.292893171310425, 5.707106590270996 ]),
    new Float32Array([ 2.617316484451294, 5.923879623413086 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 5.382683277130127, 5.923879623413086 ]),
    new Float32Array([ 5.707106590270996, 5.707106590270996 ]),
    new Float32Array([ 5.923879623413086, 5.382683277130127 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 5.923879623413086, -5.382683277130127 ]),
    new Float32Array([ 5.707106590270996, -5.707106590270996 ]),
    new Float32Array([ 5.382683277130127, -5.923879623413086 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ -5, -6 ])
  ]
  t.deepEqual(pts, exp)
})

test('offset (options): offsetting of a simple geom2 produces expected offset geom2', t => {
  let geometry = geom2.fromPoints([[-5, -5], [5, -5], [5, 5], [3, 5], [3, 0], [-3, 0], [-3, 5], [-5, 5]])

  // expand +
  let obs = offset({delta: 1}, geometry)
  let pts = geom2.toPoints(obs)
  let exp = [
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ]),
    new Float32Array([ -6, 5 ]),
    new Float32Array([ -6, -5 ])
  ]
  t.deepEqual(pts, exp)

  // contract -
  obs = offset({delta: -0.5}, geometry)
  pts = geom2.toPoints(obs)
  exp = [
    new Float32Array([ -4.5, -4.5 ]),
    new Float32Array([ 4.5, -4.5 ]),
    new Float32Array([ 4.5, 4.5 ]),
    new Float32Array([ 3.5, 4.5 ]),
    new Float32Array([ 3.5, -3.0616171314629196e-17 ]),
    new Float32Array([ 3, -0.5 ]),
    new Float32Array([ -3, -0.5 ]),
    new Float32Array([ -3.5, 3.0616171314629196e-17 ]),
    new Float32Array([ -3.5, 4.5 ]),
    new Float32Array([ -4.5, 4.5 ]),
    new Float32Array([ -4.5, -4.5 ])
  ]
  t.deepEqual(pts, exp)

  // segments 1 - sharp points at corner
  obs = offset({delta: 1, segments: 1}, geometry)
  pts = geom2.toPoints(obs)
  exp = [
    new Float32Array([ -6, -6 ]),
    new Float32Array([ -5, -6 ]),
    new Float32Array([ 5, -6 ]),
    new Float32Array([ 6, -6 ]),
    new Float32Array([ 6, -5 ]),
    new Float32Array([ 6, 5 ]),
    new Float32Array([ 6, 6 ]),
    new Float32Array([ 5, 6 ]),
    new Float32Array([ 3, 6 ]),
    new Float32Array([ 2, 6 ]),
    new Float32Array([ 2, 5 ]),
    new Float32Array([ 2, 1 ]),
    new Float32Array([ -2, 1 ]),
    new Float32Array([ -2, 5 ]),
    new Float32Array([ -2, 6 ]),
    new Float32Array([ -3, 6 ]),
    new Float32Array([ -5, 6 ]),
    new Float32Array([ -6, 6 ]),
    new Float32Array([ -6, 5 ]),
    new Float32Array([ -6, -5 ])
  ]
  t.deepEqual(pts, exp)

  // segments 16 - rounded corners
  obs = offset({delta: -0.5, segments: 16}, geometry)
  pts = geom2.toPoints(obs)
  exp = [
    new Float32Array([ -4.5, -4.5 ]),
    new Float32Array([ 4.5, -4.5 ]),
    new Float32Array([ 4.5, 4.5 ]),
    new Float32Array([ 3.5, 4.5 ]),
    new Float32Array([ 3.5, -3.0616171314629196e-17 ]),
    new Float32Array([ 3.461939811706543, -0.19134171307086945 ]),
    new Float32Array([ 3.353553295135498, -0.3535533845424652 ]),
    new Float32Array([ 3.1913416385650635, -0.4619397521018982 ]),
    new Float32Array([ 3, -0.5 ]),
    new Float32Array([ -3, -0.5 ]),
    new Float32Array([ -3.1913416385650635, -0.4619397521018982 ]),
    new Float32Array([ -3.353553295135498, -0.3535533845424652 ]),
    new Float32Array([ -3.461939811706543, -0.19134171307086945 ]),
    new Float32Array([ -3.5, 3.0616171314629196e-17 ]),
    new Float32Array([ -3.5, 4.5 ]),
    new Float32Array([ -4.5, 4.5 ]),
    new Float32Array([ -4.5, -4.5 ])
  ]
  t.deepEqual(pts, exp)
})

test('offset (options): offsetting of a complex geom2 produces expected offset geom2', t => {
  let geometry = geom2.create([
    [[-75.00000, 75.00000], [-75.00000, -75.00000]],
    [[-75.00000, -75.00000], [75.00000, -75.00000]],
    [[75.00000, -75.00000], [75.00000, 75.00000]],
    [[-40.00000, 75.00000], [-75.00000, 75.00000]],
    [[75.00000, 75.00000], [40.00000, 75.00000]],
    [[40.00000, 75.00000], [40.00000, 0.00000]],
    [[40.00000, 0.00000], [-40.00000, 0.00000]],
    [[-40.00000, 0.00000], [-40.00000, 75.00000]],
    [[15.00000, -10.00000], [15.00000, -40.00000]],
    [[-15.00000, -10.00000], [15.00000, -10.00000]],
    [[-15.00000, -40.00000], [-15.00000, -10.00000]],
    [[-8.00000, -40.00000], [-15.00000, -40.00000]],
    [[15.00000, -40.00000], [8.00000, -40.00000]],
    [[-8.00000, -25.00000], [-8.00000, -40.00000]],
    [[8.00000, -25.00000], [-8.00000, -25.00000]],
    [[8.00000, -40.00000], [8.00000, -25.00000]],
    [[-2.00000,-15.00000], [-2.00000,-19.00000]],
    [[-2.00000,-19.00000], [2.00000,-19.00000]],
    [[2.00000,-19.00000], [2.00000,-15.00000]],
    [[2.00000,-15.00000], [-2.00000,-15.00000]]
  ])

  // expand +
  let obs = offset({delta: 2, segments: 1}, geometry)
  let pts = geom2.toPoints(obs)
  let exp = [
    new Float32Array([ -77, -77 ]),
    new Float32Array([ -75, -77 ]),
    new Float32Array([ 75, -77 ]),
    new Float32Array([ 77, -77 ]),
    new Float32Array([ 77, -75 ]),
    new Float32Array([ 77, 75 ]),
    new Float32Array([ 77, 77 ]),
    new Float32Array([ 75, 77 ]),
    new Float32Array([ 40, 77 ]),
    new Float32Array([ 38, 77 ]),
    new Float32Array([ 38, 75 ]),
    new Float32Array([ 38, 2 ]),
    new Float32Array([ -38, 2 ]),
    new Float32Array([ -38, 75 ]),
    new Float32Array([ -38, 77 ]),
    new Float32Array([ -40, 77 ]),
    new Float32Array([ -75, 77 ]),
    new Float32Array([ -77, 77 ]),
    new Float32Array([ -77, 75 ]),
    new Float32Array([ 13, -38 ]),
    new Float32Array([ 13, -38 ]),
    new Float32Array([ 10, -38 ]),
    new Float32Array([ 10, -25 ]),
    new Float32Array([ 10, -23 ]),
    new Float32Array([ 8, -23 ]),
    new Float32Array([ -8, -23 ]),
    new Float32Array([ -10, -23 ]),
    new Float32Array([ -10, -25 ]),
    new Float32Array([ -10, -38 ]),
    new Float32Array([ -13, -38 ]),
    new Float32Array([ -13, -12 ]),
    new Float32Array([ 13, -12 ]),
    new Float32Array([ -4, -19 ]),
    new Float32Array([ -4, -21 ]),
    new Float32Array([ -2, -21 ]),
    new Float32Array([ 2, -21 ]),
    new Float32Array([ 4, -21 ]),
    new Float32Array([ 4, -19 ]),
    new Float32Array([ 4, -15 ]),
    new Float32Array([ 4, -13 ]),
    new Float32Array([ 2, -13 ]),
    new Float32Array([ -2, -13 ]),
    new Float32Array([ -4, -13 ]),
    new Float32Array([ -4, -15 ]),
    new Float32Array([ -77, -75 ])
  ]
  t.is(pts.length, 45)
  t.deepEqual(pts, exp)
})
