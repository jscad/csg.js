const test = require('ava')

const { degToRad } = require('../../math/utils')
const fromZRotation = require('../../math/mat4/fromZRotation')
const vec2 = require('../../math/vec2')

const fromPoints = require('./fromPoints')
const toPoints = require('./toPoints')
const transform = require('./transform')

const line = fromPoints({}, [[0, 0], [1, 0]])

test('transform: An empty path produces an empty point array', t => {
  t.deepEqual(toPoints(transform(fromZRotation(degToRad(90)), line)),
              [vec2.fromValues(0, 0), vec2.fromValues(0, 1)])
})
