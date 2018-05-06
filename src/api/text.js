const defaultFont = require('../fonts/single-line/hershey/simplex.js')
const { rectangular_extrude } = require('./ops-extrusions')
const { union } = require('./ops-booleans')

/** Represents a character as segments
* @typedef {Object} VectorCharObject
* @property {Float} width - character width
* @property {Float} height - character height (uppercase)
* @property {Array} segments - character segments [[[x, y], ...], ...]
*/

// TODO: move and comments...
function csgFromSegments (options, segments) {
  let output = []
  segments.forEach(polyline => output.push(
    rectangular_extrude(polyline, options)
  ))
  return union(output)
}

// TODO: comments
const defaultsVectorParams = {
  x: 0,
  y: 0,
  input: '?',
  height: 21, // == old vector_xxx simplex font height
  lineSpacing: 1.4285714285714286, // == 30/21 == old vector_xxx ratio
  letterSpacing: 1,
  extrude: { w: 0, h: 0 }
}

// TODO: comments
function vectorParams (options, input) {
  if (!input && typeof options === 'string') {
    options = { input: options }
  }
  options = options || {}
  let params = Object.assign({}, defaultsVectorParams, options)
  params.extrude = Object.assign({}, defaultsVectorParams.extrude, options.extrude || {})
  params.input = input || params.input
  return params
}

/** Construct a {@link VectorCharObject} from a ascii character whose code is between 32 and 127,
* if the character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii character
* @param {Float} [options.x=0] - x offset
* @param {Float} [options.y=0] - y offset
* @param {Float} [options.height=21] - font size (uppercase height)
* @param {Object} [options.extrude] - {@link rectangular_extrude} options
* @param {Float} [options.extrude.w=0] - width of the extrusion that will be applied (manually) after the creation of the character
* @param {Float} [options.extrude.h=0] - extrusion height, if > 0 the function return a CSG object
* @param {String} [options.input='?'] - ascii character (ignored/overwrited if provided as seconds parameter)
* @param {String} [char='?'] - ascii character
* @returns {VectorCharObject|CSG} vectorCharObject or an CSG object if `options.extrude.h` is > 0
*
* @example
* let vectorCharObject = vectorChar()
* or
* let vectorCharObject = vectorChar('A')
* or
* let vectorCharObject = vectorChar(36, 0, 'B')
* or
* let vectorCharObject = vectorChar({ x: 57 }, 'C')
* or
* let vectorCharObject = vectorChar({ x: 78, input: '!' })
*/
function vectorChar (options, char) {
  let { x, y, input, height, extrude } = vectorParams(options, char)
  let code = input.charCodeAt(0)
  if (!code || code < 32 || code > 126) {
    code = 63 // 63 => ?
  }
  let glyph = [].concat(defaultFont[code])
  let ratio = (height - extrude.w) / defaultFont.height
  let extrudeOffset = (extrude.w / 2)
  let width = glyph.shift() * ratio
  let segments = []
  let polyline = []
  for (let i = 0, il = glyph.length; i < il; i += 2) {
    gx = ratio * glyph[i] + x
    gy = ratio * glyph[i + 1] + y + extrudeOffset
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
  if (extrude.h) {
    return csgFromSegments(extrude, segments)
  }
  return { width, height, segments }
}

/** Construct an array of character segments from a ascii string whose characters code is between 32 and 127,
* if one character is not supported it is replaced by a question mark.
* @param {Object|String} [options] - options for construction or ascii string
* @param {Float} [options.x=0] - x offset
* @param {Float} [options.y=0] - y offset
* @param {Float} [options.height=21] - font size (uppercase height)
* @param {Float} [options.lineSpacing=1.4] - line spacing expressed as a percentage of font size
* @param {Float} [options.letterSpacing=1] - extra letter spacing expressed as a percentage of font size
* @param {Object} [options.extrude] - {@link rectangular_extrude} options
* @param {Float} [options.extrude.w=0] - width of the extrusion that will be applied (manually) after the creation of the character
* @param {Float} [options.extrude.h=0] - extrusion height, if > 0 the function return a CSG object
* @param {String} [options.input='?'] - ascii string (ignored/overwrited if provided as seconds parameter)
* @param {String} [text='?'] - ascii string
* @returns {Array|CSG} characters segments [[[x, y], ...], ...] or an CSG object if `options.extrude.h` is > 0
*
* @example
* let textSegments = vectorText()
* or
* let textSegments = vectorText('OpenJSCAD')
* or
* let textSegments = vectorText(0, -20, 'OpenJSCAD')
* or
* let textSegments = vectorText({ y: -50 }, 'OpenJSCAD')
* or
* let textSegments = vectorText({ y: -80, input: 'OpenJSCAD' })
*/
function vectorText (options, text) {
  let { x, y, input, height, extrude, lineSpacing, letterSpacing } = vectorParams(options, text)
  let output = []
  let x0 = x
  for (let i = 0; i < input.length; i++) {
    let char = input[i]
    let d = vectorChar({ x, y, height, extrude: { w: extrude.w } }, char)
    if (char === '\n') {
      x = x0
      y -= d.height * lineSpacing
      continue
    }
    x += d.width * letterSpacing
    if (char !== ' ') {
      output = output.concat(d.segments)
    }
  }
  if (extrude.h) {
    return csgFromSegments(extrude, output)
  }
  return output
}

/** Construct a {@link VectorCharObject} from a ascii character whose code is between 32 and 127,
* if the character is not supported it is replaced by a question mark.
* @param {Float} x - x offset
* @param {Float} y - y offset
* @param {String} char - ascii character
* @returns {VectorCharObject}
* @deprecated >= v2

* @example
* let vectorCharObject = vector_char(36, 0, 'B')
*/
function vector_char (x, y, char) {
  return vectorChar({ x, y }, char)
}

/** Construct an array of character segments from a ascii string whose characters code is between 32 and 127,
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
  return vectorText({ x, y }, text)
}

module.exports = {
  vector_char,
  vector_text,
  vectorChar,
  vectorText
}
