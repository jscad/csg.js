function mirror (shape3, plane) {
  return transform(shape3, Matrix4x4.mirroring(plane))
}

module.exports = mirror
