const test = require('ava')
const { outlineToPaths, create, fromSides, toString } = require('./index')

const { comparePaths } = require('../../../../test/helpers/index')

test('shape2: outlineToPaths() should return no paths for empty shape2', (t) => {
  let shp1 = create()
  let exp1 = []
  let ret1 = outlineToPaths(shp1)
  t.true(comparePaths(exp1, ret1))
})

test('shape2: outlineToPaths() should return paths for one or more outlines', (t) => {
  let shp1 = fromSides([[[-1, -1], [ 1, -1]],
                        [[ 1, -1], [ 1,  1]],
                        [[ 1,  1], [-1, -1]]])
  let exp1 = []
  let ret1 = outlineToPaths(shp1)
  t.true(comparePaths(exp1, ret1))

  let shp2 = fromSides([ [[-1, -1], [ 1, -1]],
                         [[ 1, -1], [ 1,  1]],
                         [[ 1,  1], [-1, -1]],
                         [[ 4,  4], [ 6,  4]],
                         [[ 6,  4], [ 6,  6]],
                         [[ 6,  6], [ 4,  4]] ])
  let exp2 = []
  let ret2 = outlineToPaths(shp2)
  t.true(comparePaths(exp2, ret2))
})

test.only('shape2: outlineToPaths() should return paths for holes in shape2', (t) => {
  let shp1 = fromSides([ [[ 10,  10], [-10, -10]],
                         [[-10, -10], [ 10, -10]],
                         [[ 10, -10], [ 10,  10]],
                         [[  5,  -5], [  6,  -4]],
                         [[  6,  -5], [  5,  -5]],
                         [[  6,  -4], [  6,  -5]] ])
  let exp1 = []
  let ret1 = outlineToPaths(shp1)
  t.true(comparePaths(exp1, ret1))

  let shp2 = fromSides([ [[  6, -4], [  5, -5]],
                         [[  5, -5], [  6, -5]],
                         [[  6, -5], [  6, -4]],
                         [[ 10, 10], [-10,-10]],
                         [[-10,-10], [ 10,-10]],
                         [[ 10,-10], [ 10, 10]],
                         [[ -6, -8], [  8,  6]],
                         [[  8, -8], [ -6, -8]],
                         [[  8,  6], [  8, -8]] ])
  let exp2 = []
  let ret2 = outlineToPaths(shp2)
  t.true(comparePaths(exp2, ret2))
})

// touching solids
// touching holes



