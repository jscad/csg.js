const rotate = require('./rotate')

/**
 * Calculates the normal value of the give vector
 * The normal value is the given vector rotated 90 degress.
 *
 * @param {vec2} vec - given value
 * @returns {vec2} normal value of the vector
 */
const normal = (vec) => rotate((Math.PI / 2), vec)
// old : Vector2D.Create(this._y, -this._x)

module.exports = normal
