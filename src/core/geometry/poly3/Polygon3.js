const Vector3D = require('./Vector3')
const {_CSGDEBUG, EPS, getTag} = require('../constants')

Polygon3.prototype = {

  // FIXME what? why does this return this, and not a new polygon?
  // FIXME is this used?
  setColor: function (args) {
    let newshared = Polygon3.Shared.fromColor.apply(this, arguments)
    this.shared = newshared
    return this
  }
}

/** Class Polygon3.Shared
 * Holds the shared properties for each polygon (Currently only color).
 * @constructor
 * @param {Array[]} color - array containing RGBA values, or null
 *
 * @example
 *   let shared = new CSG.Polygon3.Shared([0, 0, 0, 1])
 */
Polygon3.Shared = function (color) {
  if (color !== null && color !== undefined) {
    if (color.length !== 4) {
      throw new Error('Expecting 4 element array')
    }
  }
  this.color = color
}

Polygon3.Shared.fromObject = function (obj) {
  return new Polygon3.Shared(obj.color)
}

/** Create Polygon3.Shared from color values.
 * @param {number} r - value of RED component
 * @param {number} g - value of GREEN component
 * @param {number} b - value of BLUE component
 * @param {number} [a] - value of ALPHA component
 * @param {Array[]} [color] - OR array containing RGB values (optional Alpha)
 *
 * @example
 * let s1 = Polygon3.Shared.fromColor(0,0,0)
 * let s2 = Polygon3.Shared.fromColor([0,0,0,1])
 */
Polygon3.Shared.fromColor = function (args) {
  let color
  if (arguments.length === 1) {
    color = arguments[0].slice() // make deep copy
  } else {
    color = []
    for (let i = 0; i < arguments.length; i++) {
      color.push(arguments[i])
    }
  }
  if (color.length === 3) {
    color.push(1)
  } else if (color.length !== 4) {
    throw new Error('setColor expects either an array with 3 or 4 elements, or 3 or 4 parameters.')
  }
  return new Polygon3.Shared(color)
}

Polygon3.Shared.prototype = {
  getTag: function () {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },
    // get a string uniquely identifying this object
  getHash: function () {
    if (!this.color) return 'null'
    return this.color.join('/')
  }
}

Polygon3.defaultShared = new Polygon3.Shared(null)

module.exports = Polygon3
