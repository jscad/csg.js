const transform = require('./transform')
const mat4 = require('../../math/mat4')

const translate = (vector, shape) => transform(shape, mat4.fromTranslation(vector))

module.exports = translate
