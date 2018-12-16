const vec3 = require('./vec3')

const clone = (line) => {
  let point = vec3.clone(line[0])
  let direction = vec3.clone(line[1])
  return fromData(point, direction)
}

module.exports = clone
