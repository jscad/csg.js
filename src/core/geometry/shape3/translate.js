const transform = require('./transform')
const fromTranslation = require('../../math/mat4/fromTranslation')

function translate (vector, shape3) {
  return transform(shape3, fromTranslation(vector))
}

module.exports = translate
