/** create a copy/clone of the input geometry
 * @typedef  {import('./create').Geom3} Geom3
 * @param  {Geom3} sourceGeometry the geometry to clone
 * @returns {Geom3} the new clone
 */
const clone = (solid) => Object.assign({}, solid)

module.exports = clone
