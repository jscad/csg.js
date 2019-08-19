/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and l in the set [0, 1].
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 * @param Number r - red color value
 * @param Number g - green color value
 * @param Number b - blue color value
 * @return Array the HSL representation
 */
const rgbToHsl = (r, g, b) => {
  if (Array.isArray(r)) {
    b = r[2]
    g = r[1]
    r = r[0]
  }
  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h
  let s
  let l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
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

  return [h, s, l]
}

module.exports = rgbToHsl
