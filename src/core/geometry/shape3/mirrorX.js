function mirrorX (shape3) {
  let plane = new Plane(Vector3.Create(1, 0, 0), 0)
  return mirror(shape3, plane)
}

module.exports = mirrorX
