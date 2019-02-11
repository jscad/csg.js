const mat4 = require('../mat4')
const transform = require('./transform')

// TODO: Consider removing non-primitive operation.
const translate = (vector, poly3) =>
    transform(mat4.fromTranslation(vector), poly3)

module.exports = translate
