const test = require('ava')

const { degToRad } = require('../../math/utils')
const fromZRotation = require('../../math/mat4/fromZRotation')
const vec2 = require('../../math/vec2')

const {transform, fromPoints, toPoints} = require('./index')

const line = fromPoints({}, [[0, 0], [1, 0]])

test('transform: An populated path produces an populated point array', t => {
  t.deepEqual(toPoints(transform(fromZRotation(degToRad(90)), line)),
              [vec2.fromValues(0, 0), vec2.fromValues(0, 1)])
})
