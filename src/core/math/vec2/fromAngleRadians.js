const create = require('./create')

const fromAngleRadians = radians => {
  let out = create()
  out[0] = Math.cos(radians)
  out[1] = Math.sin(radians)
  return out
}

module.exports = fromAngleRadians
