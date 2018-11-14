const transform = require('./transform')
const fromScaling = require('../../math/mat4/fromScaling')

const scale = (vector, shape) => transform(fromScaling(vector), shape)

module.exports = scale
