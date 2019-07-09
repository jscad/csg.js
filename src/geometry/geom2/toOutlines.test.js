const test = require('ava')

const { create, toString } = require('./index')

const { comparePoints } = require('../../../test/helpers')

const toOutlines = require('./toOutlines')

test('geom2: toOutlines() should return no paths for empty geom2', (t) => {
  let shp1 = create()
  let exp1 = []
  let ret1 = toOutlines(shp1)
  t.true(comparePoints(exp1, ret1))
})

test('geom2: toOutlines() should return paths for one or more outlines', (t) => {
  let shp1 = create([[[-1, -1], [ 1, -1]],
                    [[ 1, -1], [ 1,  1]],
                    [[ 1,  1], [-1, -1]]])
  let ret1 = toOutlines(shp1)
  let exp1 = [
    [[1, -1], [1, 1], [-1, -1]]
  ]
  t.true(comparePoints(exp1[0], ret1[0]))

  let shp2 = create([ [[-1, -1], [ 1, -1]],
                      [[ 1, -1], [ 1,  1]],
                      [[ 1,  1], [-1, -1]],
                      [[ 4,  4], [ 6,  4]],
                      [[ 6,  4], [ 6,  6]],
                      [[ 6,  6], [ 4,  4]] ])
  let ret2 = toOutlines(shp2)
  let exp2 = [
    [[1, -1], [1, 1], [-1, -1]],
    [[6, 4], [6, 6], [4, 4]]
  ]
  t.true(comparePoints(exp2, ret2))
})

test('geom2: toOutlines() should return paths for holes in geom2', (t) => {
  let shp1 = create([ [[ 10,  10], [-10, -10]],
                      [[-10, -10], [ 10, -10]],
                      [[ 10, -10], [ 10,  10]],
                      [[  5,  -5], [  6,  -4]],
                      [[  6,  -5], [  5,  -5]],
                      [[  6,  -4], [  6,  -5]] ])
  let ret1 = toOutlines(shp1)
  let exp1 = [
    [ [ -10, -10 ], [ 10, -10 ], [ 10, 10 ] ],
    [ [ 6, -4 ], [ 6, -5 ], [ 5, -5 ] ]
  ]
  t.true(comparePoints(exp1, ret1))

  let shp2 = create([ [[  6, -4], [  5, -5]],
                      [[  5, -5], [  6, -5]],
                      [[  6, -5], [  6, -4]],
                      [[ 10, 10], [-10,-10]],
                      [[-10,-10], [ 10,-10]],
                      [[ 10,-10], [ 10, 10]],
                      [[ -6, -8], [  8,  6]],
                      [[  8, -8], [ -6, -8]],
                      [[  8,  6], [  8, -8]] ])
  let ret2 = toOutlines(shp2)
  let exp2 = [
    [[5, -5], [6, -5], [6, -4]],
    [[-10, -10], [10, -10], [10, 10]],
    [[8, 6], [8, -8], [-6, -8]]
  ]
  t.true(comparePoints(exp2, ret2))
})

// touching edges
// touching holes

