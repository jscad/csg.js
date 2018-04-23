const hersheyFont = require('../fonts/hershey')

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

module.exports = {
  vector_char,
  vector_text
}
