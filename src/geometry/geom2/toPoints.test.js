const test = require('ava')

const {toPoints, fromPoints, toString} = require('./index')

test('toPoints: Creates an array of points from a populated geom2', (t) => {
  const points = [new Float32Array([0, 0]), new Float32Array([1, 0]), new Float32Array([0, 1])]
  const geometry = fromPoints(points)

  const asstring = toString(geometry)
  //console.log(asstring)

  const pointarray = toPoints(geometry)
  t.deepEqual(pointarray, points)

// TODO : test with mirrored geometry, see transform.js
})