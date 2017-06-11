function vertex3Equals (t, observed, expected) {
  const obs = [observed.pos._x, observed.pos._y, observed.pos._z]
  return t.deepEqual(obs, expected)
}

function vertex2Equals (t, observed, expected) {
  const obs = [observed.pos._x, observed.pos._y]
  return t.deepEqual(obs, expected)
}

function vector3Equals (t, observed, expected) {
  const obs = [observed._x, observed._y, observed._z]
  return t.deepEqual(obs, expected)
}

function sideEquals (t, observed, expected) {
  vertex2Equals(t, observed.vertex0, expected[0], 'vertex0 are not equal')
  vertex2Equals(t, observed.vertex1, expected[1], 'vertex1 are not equal')
}

function shape2dToNestedArray (shape2d) {
  const sides = shape2d.sides.map(function (side) {
    return [side.vertex0.pos._x, side.vertex0.pos._y, side.vertex1.pos._x, side.vertex1.pos._y]
  })
  return sides
}

function shape3dToNestedArray (shape3d) {
  const polygons = shape3d.polygons.map(function (polygon) {
    return polygon.vertices.map(vertex => [vertex.pos._x, vertex.pos._y, vertex.pos._z])
  })
  return polygons
}

function simplifiedPolygon (polygon) {
  const vertices = polygon.vertices.map(vertex => [vertex.pos._x, vertex.pos._y, vertex.pos._z])
  const plane = {normal: [polygon.plane.normal._x, polygon.plane.normal._y, polygon.plane.normal._z], w: polygon.plane.w}
  return {positions: vertices, plane, shared: polygon.shared}
}

module.exports = {
  vertex2Equals,
  vertex3Equals,
  vector3Equals,
  sideEquals,
  shape2dToNestedArray,
  simplifiedPolygon
}
