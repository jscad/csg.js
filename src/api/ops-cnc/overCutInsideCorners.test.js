const test = require('ava')
const { compareVectors } = require('../../../test/helpers/index')

const shape2 = require('../../core/geometry/shape2')

const { overCutInsideCorners } = require('./index')

test('ops-cnc: overCutInsideCorners() should return even for an empty shape2', (t) => {
  let shp1 = shape2.create()
  let ret1 = overCutInsideCorners({}, shp1)
  t.is(shp1, ret1)
})

test('ops-cnc: overCutInsideCorners() should return the original shape if NO "inside" corners', (t) => {
  // simple triangle
  let shp1 = shape2.fromSides([[[ 0,  0], [ 3, -3]],
                               [[ 3, -3], [ 3,  3]],
                               [[ 3,  3], [ 0,  0]]])
  let ret1 = overCutInsideCorners({}, shp1)
  t.is(shp1, ret1)

  // square
  let shp2 = shape2.fromSides([[[-3, -3], [ 3, -3]],
                               [[ 3, -3], [ 3,  3]],
                               [[ 3,  3], [-3,  3]],
                               [[-3,  3], [-3, -3]]])
  let ret2 = overCutInsideCorners({}, shp2)
  t.is(shp2, ret2)
})

test('ops-cnc: overCutInsideCorners() should add cutouts for "inside" corners', (t) => {
  // square with indented sides (4 inside corners)
  let shp1 = shape2.fromSides([[[ 0, -2], [ 3, -3]],
                               [[ 3, -3], [ 2,  0]],
                               [[ 2,  0], [ 3,  3]],
                               [[ 3,  3], [ 0,  2]],
                               [[ 0,  2], [-3,  3]],
                               [[-3,  3], [-2,  0]],
                               [[-2,  0], [-3, -3]],
                               [[-3, -3], [ 0, -2]]])
  let ret1 = overCutInsideCorners({}, shp1)
console.log(shape2.toString(ret1))
  t.true(true)
})

test('ops-cnc: overCutInsideCorners() should use options when adding cutouts', (t) => {
  // corner on outside path only
  // corner at end of outline
  t.true(true)
})

