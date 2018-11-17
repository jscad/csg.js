const geom2 = require('../geometry/geom2')

/** Calculate the area of the given Shape2
 * @param  {Shape2} shape
 * @returns {float} the area of the 2d geometry
 */
const measureArea = shape => geom2.measureArea(shape.geometry)

module.exports = measureArea
