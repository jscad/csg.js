const hersheyFont = require('../fonts/hershey')
const { fromPoints } = require('../core/CAGFactories')
const Path2D = require('../core/math/Path2')

/** Construct a with, segments tupple from a character
 * @param {Float} x - x offset
 * @param {Float} y - y offset
 * @param {Float} char - character
 * @returns {Object} { width: X, segments: [...] }
 *
 * @example
 * let charData = vector_char(0, 12.2, 'b')
 */
function vector_char (x, y, char) {
  char = char.charCodeAt(0)
  char -= 32
  if (char < 0 || char >= 95) return { width: 0, segments: [] }

  let off = char * 112
  let n = hersheyFont[off++]
  let w = hersheyFont[off++]
  let l = []
  let segs = []

  for (let i = 0; i < n; i++) {
    let xp = hersheyFont[off + i * 2]
    let yp = hersheyFont[off + i * 2 + 1]
    if (xp === -1 && yp === -1) {
      segs.push(l); l = []
    } else {
      l.push([xp + x, yp + y])
    }
  }
  if (l.length) segs.push(l)
  return { width: w, segments: segs }
}

/** Construct an array of with, segments tupple from a string
 * @param {Float} x - x offset
 * @param {Float} y - y offset
 * @param {Float} string - string
 * @returns {Array} [{ width: X, segments: [...] }]
 *
 * @example
 * let stringData = vector_text(0, 12.2, 'b')
 */
function vector_text (x, y, string) {
  let output = []
  let x0 = x
  for (let i = 0; i < string.length; i++) {
    let char = string.charAt(i)
    if (char === '\n') {
      x = x0; y -= 30
    } else {
      let d = vector_char(x, y, char)
      x += d.width
      output = output.concat(d.segments)
    }
  }
  return output
}

/** Construct an array of CAG from a string
 * @param {Object} options - text options
 * @param {String} options.text - string
 * @param {opentype.Font} options.font - font object from opentype.js
 * @param {Float} [options.size=12] - text size (height)
 * @param {Float} [options.x=0] - x offset
 * @param {Float} [options.y=0] - y offset
 * @param {Boolean} [options.kerning=true] - see opentype.js
 * @param {Boolean} [options.features=true] - see opentype.js
 * @param {Boolean} [options.hinting=false] - see opentype.js
 * @returns {CAG[]}
 *
 * @example
 * let cagText = text({ text: 'HelloWorld!', font: font(roboto) })
 */
function text (options) {
  options = options || {}

  if (!options.text || !options.font) {
    throw new Error('text and font parameter must be defined')
  }

  if (!options.font.getPath) {
    throw new Error('font parameter must have an getPath() method')
  }

  // opentype.Font.getPaths() return one SVG path by char
  let paths = options.font.getPaths(options.text, options.x, options.y, options.size || 12, {
    kerning: options.kerning !== undefined ? options.kerning : true,
    features: options.features !== undefined ? options.features : true,
    hinting: options.hinting !== undefined ? options.hinting : false
  })

  let output = [] // array of CAG chars

  // For each path (char)
  paths.forEach(path => {
    // For each command (SVG style)
    // opentype.js output path with only [M, L, Q, C, Z] commands
    // https://github.com/nodebox/opentype.js/blob/5e71fcec2e237a8b3b5c034eed6973d18f69a8fc/src/glyph.js#L155
    let pointsList = []
    let points = []
    path.commands.forEach(command => {
      switch (command.type) {
        case 'M': // new path
          points = new Path2D([[command.x, command.y]], false)
          break
        case 'L': // line to
          points = points.appendPoint([command.x, command.y])
          break
        case 'Q': // absolute quadratic Bézier
          points = points.appendBezier([
            [command.x1, command.y1],
            [command.x1, command.y1],
            [command.x, command.y]
          ])
          break
        case 'C': // absolute cubic Bézier
          points = points.appendBezier([
            [command.x1, command.y1],
            [command.x2, command.y2],
            [command.x, command.y]
          ])
          break
        case 'Z': // end of path
          pointsList.push(points)
          break
        default:
          console.log('Warning: Unknow PATH command [' + command.type + ']')
          break
      }
    })

    pointsList = pointsList.map(pl => pl.points)
    output.push(fromPoints(pointsList))
  })

  return output
}

module.exports = {
  vector_char,
  vector_text,
  text
}
