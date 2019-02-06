const equals = require('./equals')
const flip = require('./flip')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const transform = require('./transform')

const polygon = [[0, 1], [0, 0], [2, 0], [2, 1]]
const polygonArray = [polygon]
const polygonArrayFlipped = polygonArray.slice().reverse()

test('fromPolygonArray: Roundtrip ', t => {
  t.deepEqual(toPolygonArray({}, fromPolygonArray({}, polygonArray)),
              polygonArray)
})

test('fromPolygonArray: Roundtrip when flipped', t => {
  t.deepEqual(toPolygonArray(
                  {},
                  fromPolygonArray({ flipped: true }, polygonArray)),
              polygonArrayFlipped)
})
