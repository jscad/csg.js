
const xAtY = (line, y) => {
  // px = (distance - normal.y * y) / normal.x
  let x = (line[2] - (line[1] * y)) / line[0]
  return x
}

module.exports = xAtY
