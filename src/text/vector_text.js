const vectorText = require('./vectorText')

/** Construct an array of character segments from a ascii string whose characters code is between 31 and 127,
* if one character is not supported it is replaced by a question mark.
* @param {Float} x - x offset
* @param {Float} y - y offset
* @param {String} text - ascii string
* @returns {Array} characters segments [[[x, y], ...], ...]
* @deprecated >= v2
*
* @example
* let textSegments = vector_text(0, -20, 'OpenJSCAD')
*/
function vector_text (x, y, text) {
  return vectorText({ xOffset: x, yOffset: y }, text)
}

module.exports = vector_text
