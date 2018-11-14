
const transform = require('./transform')
const mat4 = require('../../math/mat4')

const rotateY = (deg, shape) => transform(mat4.fromYRotation(deg), shape)

module.exports = rotateY
