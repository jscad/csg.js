const toArray = require('../core/utils/toArray')

/**
 * centers the given object(s) on the given axes
 * @param {Object|Array} object(s) the shapes to center
 * @param {Object} options
 */
const centerV2 = function (objects, options) {
  const defaults = {
    axes: [1, 1, 1]
  }
  options = Object.assign({}, defaults, options)
  const {axes} = options
  objects = toArray(objects)

  const results = objects.map(function (object) {
    let b = object.getBounds()
    let offset = [0,0,0]
    if (axes[0]) offset[0] = 0 - (b[0]._x + ((b[1]._x - b[0]._x) / 2))
    if (axes[1]) offset[1] = 0 - (b[0]._y + ((b[1]._y - b[0]._y) / 2))
    if (axes[2]) offset[2] = 0 - (b[0]._z + ((b[1]._y - b[0]._y) / 2))
    return object.translate(offset)
  })
  // if there is more than one result, return them all , otherwise a single one
  return results.length === 1 ? results[0] : results
}

module.exports = centerV2
