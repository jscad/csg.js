const transform = require('./transform')
const fromScaling = require('../../math/mat4/fromScaling')

function scale (vector, shape3) {
  return transform(shape3, fromScaling(vector))
}

module.exports = scale
