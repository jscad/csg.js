/**
 * Performs a shallow copy of the given geometry.
 * @params {geom3} geometry - the geometry to make a shallow copy of.
 * @returns {geom3} the copied geometry
 */
const clone = (geometry) => Object.assign({}, geometry)

module.exports = clone
