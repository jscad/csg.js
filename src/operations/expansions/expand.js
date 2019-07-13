const flatten = require('../../utils/flatten')

const { geom2, geom3, path2 } = require('../../geometry')

const expandGeom2 = require('./expandGeom2')
const expandGeom3 = require('./expandGeom3')
const expandPath2 = require('./expandPath2')

/**
 * Expand the given object(s) using the given options (if any)
 * @param {Object} options - options for expand
 * @param {Number} options.delta=1 - delta (+/-) of expansion
 * @param {Integer} [options.segments] - number of segments when creating rounded corners, or zero for chamfer
 * @param {Object|Array} objects - the objects(s) to expand
 * @return {Object|Array} the expanded object(s)
 *
 * @example
 * let newsphere = expand({delta: 2}, cube({center: [0,0,15], size: [20, 25, 5]}))
 */
const expand = function (options, ...objects) {
  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  const results = objects.map(function (object) {
    if (path2.isA(object)) return expandPath2(options, object)
    if (geom2.isA(object)) return expandGeom2(options, object)
    if (geom3.isA(object)) return expandGeom3(options, object)
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = expand
