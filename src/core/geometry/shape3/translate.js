const transform = require('./transform')
const mat4 = require('../../math/mat4')

const translate = (vector, shape3) => transform(shape3, mat4.fromTranslation(vector))

module.exports = translate
