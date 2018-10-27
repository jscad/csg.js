const vec3 = require('../../math/vec3')

// returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
const measureBoundingBox = poly3 => {
  let vertices = poly3.vertices
  let numvertices = vertices.length
  let min = numvertices === 0 ? vec3.create() : vertices[0]
  let max = min
  for (let i = 1; i < numvertices; i++) {
    min = vec3.min(min, vertices[i])
    max = vec3.max(max, vertices[i])
  }
  return [min, max]
}

module.exports = measureBoundingBox
