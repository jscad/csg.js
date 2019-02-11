const plane = require('../plane')
const vec3 = require('../vec3')

const toString = (poly3) => {
  let result = `poly3: plane: ${plane.toString(poly3.plane)}, vertices: [`
  poly3.forEach((vertex) => {
    result += `${vec3.toString(vertex)}, `
  })
  result += ']'
  return result
}

module.exports = toString
