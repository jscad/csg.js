const vec3 = require('../../../math/vec3/')

const toString = (slice) => {
  let result = `[`
  slice.edges.forEach((edge) => {
    result += `[${vec3.toString(edge[0])}, ${vec3.toString(edge[1])}], `
  })
  result += ']'
  return result
}

module.exports = toString
