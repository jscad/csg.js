const equals = require('./equals')
const flip = require('./flip')
const fromPolygonArray = require('./fromPolygonArray')
const test = require('ava')
const toPolygonArray = require('./toPolygonArray')
const transform = require('./transform')

const rectanglePolygonArray = [[[0, 1], [0, 0], [2, 0], [2, 1]]]
const rectangle = fromPolygonArray({}, rectanglePolygonArray)

test('flip: Unflipped surfaces are wound forward', t => {
  t.deepEqual(toPolygonArray({}, rectangle),
               [[[0, 1], [0, 0], [2, 0], [2, 1]]])
})

test('flip: Flipped surfaces are wound backward', t => {
  t.deepEqual(toPolygonArray({}, flip(rectangle)),
              [[[2, 1], [2, 0], [0, 0], [0, 1]]])
})
