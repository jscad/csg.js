/**
 * Converts an RGB color value to HSV.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and v in the set [0, 1].
 *
 * @see http://en.wikipedia.org/wiki/HSV_color_space.
 * @param Number r - the red color value
 * @param Number g - the green color value
 * @param Number b - the blue color value
 * @return Array the HSV representation
 */
const rgbToHsv = (r, g, b) => {
  if (Array.isArray(r)) {
    b = r[2]
    g = r[1]
    r = r[0]
  }
  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h
  let s
  let v = max

  let d = max - min
  s = max === 0 ? 0 : d / max

  if (max === min) {
    h = 0 // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h, s, v]
}

module.exports = rgbToHsv
