const geom3 = require('./geom3')
const clone = require('./clone')
// TODO: flip properties?
// TODO: is this too close to negate() ?

/**
 * Return a new Shape3 solid with solid and empty space switched.
 * This solid is not modified.
 * @returns {Shape3} new Shape3 object
 * @example
 * let B = invert(A)
 */
const invert = shape3 => {
  const newShape = clone(shape3)
  newShape.geometry = geom3.invert(shape3.geometry)
  return newShape
}

module.exports = invert
