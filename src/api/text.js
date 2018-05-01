const defaultFont = require('../fonts/single-line/hershey/simplex.js')

/** Represents a character as segments
* @typedef {Object} VectorCharObject
* @property {Float} width - character width
* @property {Float} height - character height (uppercase)
* @property {Array} segments - character segments [[[x, y], ...], ...]
*/

/** Construct a {@link VectorCharObject} from a ascii character whose code is between 32 and 127,
* if the character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii char
* @param {Float} [options.x=0] - x offset
* @param {Float} [options.y=0] - y offset
* @param {Float} [options.height=10] - font size (uppercase height)
* @param {Float} [options.extrudeOffset=0] - size of the extrusion that will be applied manually after the creation of the character
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
  let settings = Object.assign({
    x: 0,
    y: 0,
    height: 10,
    extrudeOffset: 0
  }, options || {})
  char = char || settings.char || '?'
  let x = parseFloat(settings.x)
  let y = parseFloat(settings.y)
  let height = parseFloat(settings.height)
  let extrudeOffset = parseFloat(settings.extrudeOffset)
  let code = char.charCodeAt(0)
  if (!code || code < 33 || code > 126) {
    code = 63 // 63 => ?
  }
  let glyph = [].concat(defaultFont[code])
  let ratio = (height - extrudeOffset) / defaultFont.height
  let width = glyph.shift() * ratio
  let segments = []
  let polyline = []
  for (let i = 0, il = glyph.length; i < il; i += 2) {
    gx = ratio * glyph[i] + x
    gy = ratio * glyph[i + 1] + y + 1
    if (glyph[i] !== undefined) {
      polyline.push([ gx, gy ])
      continue
    }
    segments.push(polyline)
    polyline = []
    i--
  }
  if (polyline.length) {
    segments.push(polyline)
  }
  return { width, height, segments }
}

/** Construct an array of character segments from a ascii string whose characters code is between 32 and 127,
* if one character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii string
* @param {Float} [options.x=0] - x offset
* @param {Float} [options.y=0] - y offset
* @param {Float} [options.height=10] - font size (uppercase height)
* @param {Float} [options.extrudeOffset=0] - size of the extrusion that will be applied manually after the creation of the character
* @param {Float} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
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
  let settings = Object.assign({
    x: 0,
    y: 0,
    lineSpacing: 1.4
  }, options || {})
  text = text || settings.text || 'OpenJSCAD'
  let x = parseFloat(settings.x)
  let y = parseFloat(settings.y)
  let lineSpacing = parseFloat(settings.lineSpacing)
  let output = []
  let x0 = x
  for (let i = 0; i < text.length; i++) {
    let char = text[i]
    let d = vector_char(Object.assign({}, settings, { x, y }), char)
    if (char === '\n') {
      x = x0
      y -= d.height * lineSpacing
      continue
    }
    x += d.width
    if (char !== ' ') {
      output = output.concat(d.segments)
    }
  }
  return output
}

module.exports = {
  vector_char,
  vector_text
}
