const transform = require('./transform')

// const fromRotation = require('../../math/mat4/fromRotation')

function mirror (plane, shape2) {
  return transform(Matrix4x4.mirroring(plane), shape2)
}

module.exports = mirror
