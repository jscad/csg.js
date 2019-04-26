const geom3 = require('../geometry/geom3')
const poly3 = require('../geometry/poly3')

/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of cuboid
 * @param {Array} [options.radius=[1,1,1]] - radius of cuboid
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let mycube = cuboid({center: [5, 5, 5], radius: [5, 10, 5]})
 */
const cuboid = function (options) {
  const defaults = {
    center: [0, 0, 0],
    radius: [1, 1, 1],
  }
  let {center, radius} = Object.assign({}, defaults, options)

  let result = geom3.create(
    // adjust a basic shape to center and radius
    [
      [ [0, 4, 6, 2], [-1, 0, 0] ],
      [ [1, 3, 7, 5], [+1, 0, 0] ],
      [ [0, 1, 5, 4], [0, -1, 0] ],
      [ [2, 6, 7, 3], [0, +1, 0] ],
      [ [0, 2, 3, 1], [0, 0, -1] ],
      [ [4, 5, 7, 6], [0, 0, +1] ]
    ].map((info) => {
      let points = info[0].map((i) => {
        let pos = [
          center[0] + radius[0] * (2 * !!(i & 1) - 1),
          center[1] + radius[1] * (2 * !!(i & 2) - 1),
          center[2] + radius[2] * (2 * !!(i & 4) - 1)
        ]
        return pos
      })
      return poly3.fromPoints(points)
    })
  )
  return result
}

module.exports = cuboid
