const {extrude} = require('./extrusionUtils')
/** linear extrusion of the input 2d shape
 * @param {Object} [options] - options for construction
 * @param {Float} [options.height=1] - height of the extruded shape
 * @param {Integer} [options.slices=10] - number of intermediary steps/slices
 * @param {Integer} [options.twist=0] - angle (in degrees to twist the extusion by)
 * @param {Boolean} [options.center=false] - whether to center extrusion or not
 * @param {CAG} baseShape input 2d shape
 * @returns {CSG} new extruded shape
 *
 * @example
 * let revolved = linearExtrude({height: 10}, square())
 */
function linearExtrude (params, baseShape) {
  const defaults = {
    height: 1,
    slices: 10,
    twist: 0,
    center: false
  }
  /* convexity = 10, */
  const {height, twist, slices, center} = Object.assign({}, defaults, params)

  // if(params.convexity) convexity = params.convexity      // abandoned
  let output = extrude(baseShape, {offset: [0, 0, height], twistangle: twist, twiststeps: slices})
  if (center === true) {
    const b = output.getBounds() // b[0] = min, b[1] = max
    const offset = (b[1].plus(b[0])).times(-0.5)
    output = output.translate(offset)
  }
  return output
}

module.exports = linearExtrude
