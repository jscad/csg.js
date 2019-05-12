const {geom3, poly3} = require('../geometry')

/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of cuboid
 * @param {Array} [options.radius=[1,1,1]] - radius of cuboid
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let myshape = cuboid({center: [5, 5, 5], radius: [5, 10, 5]})
 */
const cuboid = (options) => {
  const defaults = {
    center: [0, 0, 0],
    radius: [1, 1, 1],
  }
  let {center, radius} = Object.assign({}, defaults, options)

  if (!Array.isArray(center)) throw new Error('center must be an array')
  if (center.length < 3) throw new Error('center must contain X, Y and Z values')

  if (!Array.isArray(radius)) throw new Error('radius must be an array')
  if (radius.length < 3) throw new Error('radius must contain X, Y and Z values')

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

/** Construct an axis-aligned solid cube with six square faces.
 * @see {@link cuboid} for more options, as this is an alias to cuboid
 * @param {Object} [options] - options for construction
 * @param {Array} [options.center=[0,0,0]] - center of cube
 * @param {Number} [options.radius=1 - radius of cube
 * @returns {geom3} new 3D geometry
 *
 * @example
 * let mycube = cube({center: [5, 5, 5], radius: 5})
 */
const cube = (options) => {
  const defaults = {
    center: [0, 0, 0],
    radius: 1,
  }
  let {center, radius} = Object.assign({}, defaults, options)

  // TODO check that radius is a number

  radius = [radius, radius, radius]

  return cuboid({center: center, radius: radius})
}

module.exports = {
  cube,
  cuboid
}
