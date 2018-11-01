const mat4 = require('../../math/mat4')
const geom2 = require('./geom2')
/**
 * create shape2/ CAG
 * Holds a solid area geometry like CSG but 2D.
 * Each area consists of a number of sides.
 * Each side is a line between 2 points.
 * @constructor
 */
const create = function () {
  return {
    type: 'shape2',
    curves: [], // not sure if sides or curves will be kept (either or)

    geometry: geom2.create(),
    transforms: mat4.identity(),
    isNegative: false
  }
}

module.exports = create
