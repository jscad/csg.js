const defaultPathGeometry = require('./defaultPathGeometry')
const path = require('../../geometry/path')
const mat4 = require('../../math/mat4')
const test = require('ava')
const Path2D = require('./Path2D')
const call = require('../registry/call')

// Hook up geometry/path as the implementation for the v1 api to use by default.
call(defaultPath, path)

test('Empty path has no points', t => {
  t.deepEqual(new Path2D().getPoints(), [])
})

test('Empty path with one appended has one point', t => {
  t.deepEqual(new Path2D().appendPoint([0, 0]).getPoints(), [[0, 0]])
})

test('Empty path with two appended has two point', t => {
  t.deepEqual(new Path2D().appendPoints([[0, 0], [1, 1]]).getPoints(), [[0, 0], [1, 1]])
})

test('Path.arc() works', t => {
  t.deepEqual(Path2D.arc({ center: [5, 5], radius: 10, startangle: 90, endangle: 180, resolution: 36, maketangent: true }).getPoints(),
              [[ 5,                  15],
               [ 4.9127302169799805, 14.99962043762207],
               [ 3.3667399883270264, 14.86571979522705],
               [ 1.8600800037384033, 14.49425983428955],
               [ 0.4290199875831604, 13.894160270690918],
               [-0.8919600248336792, 13.079899787902832],
               [-2.0710699558258057, 12.071069717407227],
               [-3.079900026321411,  10.891960144042969],
               [-3.894160032272339,  9.570980072021484],
               [-4.494259834289551,  8.13992977142334],
               [-4.865719795227051,  6.6332597732543945],
               [-4.999619960784912,  5.0872697830200195],
               [-5,                  5]])
})

test('Path concatenation works', t => {
  t.deepEqual(new Path2D([[1, 2]]).concat(new Path2D([[3, 4]])).getPoints(),
              [[1, 2], [3, 4]])
})

test('Closed path is closed', t => {
  t.true(new Path2D().close().isClosed())
})

test('Straight path is straight', t => {
  t.is(new Path2D([[0, 0], [0, 1], [0, 2]]).close().getTurn(), 'straight')
})

test('Right turn path has counter-clockwise turn', t => {
  t.is(new Path2D([[0, 0], [0, 1], [-1, 1]]).close().getTurn(), 'clockwise')
})

test('Left turn path has clockwise turn', t => {
  t.is(new Path2D([[0, 0], [0, 1], [+1, 1]]).close().getTurn(), 'counter-clockwise')
})

test('Transform works', t => {
  t.deepEqual(new Path2D([[0, 0], [0, 1]]).transform(mat4.fromZRotation(90 * 0.017453292519943295)).getPoints(),
              [[0, 0], [-1, 0]])
})
