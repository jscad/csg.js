const transform = require('./transform')
const fromScaling = require('../../math/mat4/fromScaling')

const scale = (vector, shape3) => transform(fromScaling(vector), shape3)

module.exports = scale
