const transform = require('./transform')
const fromScaling = require('../../math/mat4/fromScaling')

/** return a clone of the input shape, scaled by the given Vec3
 * @param  {Vec3} scaleVector the Vec3 to scale the input shape by, along x,y,z
 * @param  {Shape3} shape the original shape
 * @returns {Shape3} the rotated shape
 */
const scale = (scaleVector, shape) => transform(fromScaling(scaleVector), shape)

module.exports = scale
