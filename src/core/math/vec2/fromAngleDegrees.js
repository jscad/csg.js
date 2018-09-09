const create = require('./create')

const fromAngleDegrees = (degrees) => {
  const radians = Math.PI * degrees / 180
  let out = create()
  out[0] = Math.cos(radians)
  out[1] = Math.sin(radians)
  return out
}

module.exports = fromAngleDegrees
