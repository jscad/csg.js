/**
 * Converts an HSV color value to RGB.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @see http://en.wikipedia.org/wiki/HSV_color_space.
 * @param Number h - hue
 * @param Number s - saturation
 * @param Number v - value
 * @return Array the RGB representation
 */
const hsvToRgb = (h, s, v) => {
  if (Array.isArray(h)) {
    v = h[2]
    s = h[1]
    h = h[0]
  }
  let r = 0
  let g = 0
  let b = 0

  let i = Math.floor(h * 6)
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)

  switch (i % 6) {
    case 0:
      r = v
      g = t
      b = p
      break
    case 1:
      r = q
      g = v
      b = p
      break
    case 2:
      r = p
      g = v
      b = t
      break
    case 3:
      r = p
      g = q
      b = v
      break
    case 4:
      r = t
      g = p
      b = v
      break
    case 5:
      r = v
      g = p
      b = q
      break
  }

  return [r, g, b]
}

module.exports = hsvToRgb
