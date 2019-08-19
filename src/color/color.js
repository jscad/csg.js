const flatten = require('../utils/flatten')

const colorNameToRgb = require('./colorNameToRgb')

/**
 * Apply the given color to the given objects.
 * @param {Object} color - either an array or a hex string of color values
 * @param {Object|Array} objects - the objects of which to color
 * @returns {Object|Array} the same objects with an additional attribute 'color'
 *
 * @example
 * let redSphere = color([1,0,0,1], sphere())
 * let greenCircle = color('green', circle())
 * let blueArc = color('aa', arc())
 */
const color = (color, ...objects) => {
  if (!color) throw new Error('color must be an array, or a valid color name')
  if (typeof color === 'string') {
    color = colorNameToRgb(color)
    if (!color) throw new Error('the given color name is unknown. see cssColors')
  }
  // now assume color is an array
  if (!Array.isArray(color)) throw new Error('color must be an array')
  if (color.length < 3) throw new Error('color must contain R, G and B values')
  if (color.length === 3) color = [color[0], color[1], color[2], 1.0] // add alpha

  // TODO check RGB values are between 0.0 to 1.0

  objects = flatten(objects)
  if (objects.length === 0) throw new Error('wrong number of arguments')

  const results = objects.map((object) => {
    object.color = color
    return object
  })
  return results.length === 1 ? results[0] : results
}

module.exports = color
