const mat4 = require('../../math/mat4')
const transform = require('./transform')

/**
 * @param  {} plane
 * @param  {} shape3
 */
const mirror = (plane, shape3) => transform(mat4.mirror(plane, mat4.create()), shape3)

module.exports = mirror
