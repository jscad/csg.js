module.exports = normal

const rotate = require('./rotate')

// returns the vector rotated by 90 degrees clockwise
function normal (vector) {
  return rotate((Math.PI / 2), vector)
}
