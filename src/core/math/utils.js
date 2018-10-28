// degrees = radians * 180 / PI
const radToDeg = radians => radians * 57.29577951308232
// radians = degrees * PI / 180
const degToRad = degrees => degrees * 0.017453292519943295

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const solve2Linear = function (a, b, c, d, u, v) {
  let det = a * d - b * c
  let invdet = 1.0 / det
  let x = u * d - b * v
  let y = -u * c + a * v
  x *= invdet
  y *= invdet
  return [x, y]
}

module.exports = { radToDeg, degToRad, clamp, solve2Linear }
