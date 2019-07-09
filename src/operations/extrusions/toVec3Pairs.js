const { vec3 } = require('../../math')

const { geom2 } = require('../../geometry')

const toVec3Pairs = (matrix, geometry) => {
  const sides = geom2.toSides(geometry)
  const pairs = sides.map((side) => {
    let v0 = vec3.fromVec2(side[0])
    let v1 = vec3.fromVec2(side[1])
    vec3.transform(v0, matrix, v0)
    vec3.transform(v1, matrix, v1)
    return [v0, v1]
  })
  return pairs
}

module.exports = toVec3Pairs
