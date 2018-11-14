const transform = require('./transform')
const mat4 = require('../../math/mat4')

const rotateX = (deg, shape) => transform(mat4.fromXRotation(deg), shape)

module.exports = rotateX
