const mat4 = require('../../math/mat4')
const transform = require('./transform')

/**
 * @param  {Vec4} plane
 * @param  {Shape3} shape
 */
const mirror = (plane, shape) => transform(mat4.mirror(plane, mat4.create()), shape)

module.exports = mirror
