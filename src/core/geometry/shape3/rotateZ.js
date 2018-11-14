const transform = require('./transform')
const mat4 = require('../../math/mat4')

const rotateZ = (deg, shape) => transform(mat4.fromZRotation(deg), shape)

module.exports = rotateZ
