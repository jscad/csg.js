const defaultFont = require('../fonts/single-line/hershey/simplex.js')

/** Represents a character as segments
* @typedef {Object} VectorCharObject
* @property {Float} width - character width
* @property {Array} segments - character segments [[[x, y], ...], ...]
*/

/** Construct a {@link VectorCharObject} from a ascii character whose code is between 32 and 127,
* if the character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii char
* @param {Float} [options.x='0'] - x offset
* @param {Float} [options.y='0'] - y offset
* @param {String} [options.char='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
* @param {String} [char='?'] - ascii character
* @returns {VectorCharObject}
*
* @example
* let vectorCharObject = vector_char()
* or
* let vectorCharObject = vector_char('A')
* or
* let vectorCharObject = vector_char(36, 0, 'B')
* or
* let vectorCharObject = vector_char({ x: 57 }, 'C')
* or
* let vectorCharObject = vector_char({ x: 78, char: '!' })
*/
function vector_char (options, char) {
  if (arguments.length === 1 && typeof options === 'string') {
    char = options
    options = null
  } else if (arguments.length === 3) { // backward compatibility
    options = { x: options, y: char }
    char = arguments[2]
  }
  let settings = Object.assign({ x: 0, y: 0 }, options || {})
  char = char || settings.char || '?'
  let x = parseFloat(settings.x)
  let y = parseFloat(settings.y)
  let code = char.charCodeAt(0)
  if (!code || code < 33 || code > 126) {
    code = 63 // 63 => ?
  }
  let glyph = [].concat(defaultFont[code])
  let width = glyph.shift()
  let segments = []
  let polyline = []
  for (let i = 0, il = glyph.length; i < il; i += 2) {
    if (glyph[i] !== undefined) {
      polyline.push([ glyph[i] + x, glyph[i + 1] + y + 1 ])
      continue
    }
    segments.push(polyline)
    polyline = []
    i--
  }
  if (polyline.length) {
    segments.push(polyline)
  }
  return { width, segments }
}

/** Construct an array of character segments from a ascii string whose characters code is between 32 and 127,
* if one character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii string
* @param {Float} [options.x='0'] - x offset
* @param {Float} [options.y='0'] - y offset
* @param {String} [options.text='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
* @param {String} [text='?'] - ascii string
* @returns {Array} segments - characters segments [[[x, y], ...], ...]
*
* @example
* let textSegments = vector_text()
* or
* let textSegments = vector_text('OpenJSCAD')
* or
* let textSegments = vector_text(0, -20, 'OpenJSCAD')
* or
* let textSegments = vector_text({ y: -50 }, 'OpenJSCAD')
* or
* let textSegments = vector_text({ y: -80, text: 'OpenJSCAD' })
*/
function vector_text (options, text) {
  if (arguments.length === 1 && typeof options === 'string') {
    text = options
    options = null
  } else if (arguments.length === 3) { // backward compatibility
    options = { x: options, y: text }
    text = arguments[2]
  }
  let settings = Object.assign({ x: 0, y: 0 }, options || {})
  text = text || settings.text || 'OpenJSCAD'
  let x = parseFloat(settings.x)
  let y = parseFloat(settings.y)
  let output = []
  let x0 = x
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    if (char === '\n') {
      x = x0
      y -= 30
      continue
    }
    if (char === ' ') {
      x += 16
      continue
    }
    let d = vector_char(x, y, char)
    output = output.concat(d.segments)
    x += d.width
  }
  return output
}

module.exports = {
  vector_char,
  vector_text
}
