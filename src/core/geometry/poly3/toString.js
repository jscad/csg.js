const plane = require('../../math/plane/')
const vec3 = require('../../math/vec3/')

const toString = (poly3) => {
  let result = 'poly3: plane: ' + plane.toString(poly3.plane) + ' vectors: ['
  poly3.vectors.map(function (vector) {
    result += '  ' + vec3.toString(vector) + '\n'
  })
  result += ']'
  return result
}

module.exports = toString
