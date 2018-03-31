mirroredX: function () {
  let plane = new Plane(Vector3.Create(1, 0, 0), 0)
  return this.mirrored(plane)
},