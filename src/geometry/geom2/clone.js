/**
 * Performs a shallow copy of the given geometry.
 * @params {geom2} geometry - the geometry to make a shallow copy of
 * @returns {geom2} new geometry
 */
const clone = (geometry) => Object.assign({}, geometry)

module.exports = clone
