
// measure the area of the given poly3 (3D planar polygon)
// translated from the orginal C++ code from Dan Sunday
// 2000 softSurfer http://geomalgorithms.com
const measureArea = (poly3) => {
  let n = poly3.vertices.length
  if (n < 3) {
    return 0 // degenerate polygon
  }
  let vertices = poly3.vertices

// calculate a real normal
  let a = vertices[0].pos
  let b = vertices[1].pos
  let c = vertices[2].pos
  let normal = b.minus(a).cross(c.minus(a))
  //let normal = poly3.plane.normal // unit based normal, CANNOT use

// determin direction of projection
  let ax = Math.abs(normal._x)
  let ay = Math.abs(normal._y)
  let az = Math.abs(normal._z)
  let an = Math.sqrt( (ax * ax) + (ay * ay) + (az * az)) // length of normal

  let coord = 3 // ignore Z coordinates
  if ((ax > ay) && (ax > az)) {
    coord = 1 // ignore X coordinates
  } else
  if (ay > az) {
    coord = 2 // ignore Y coordinates
  }

  let area = 0
  let h = 0
  let i = 1
  let j = 2
  switch (coord) {
    case 1: // ignore X coordinates
    // compute area of 2D projection
      for (i = 1; i < n; i++) {
        h = i - 1
        j = (i + 1) % n
        area += (vertices[i].pos._y * (vertices[j].pos._z - vertices[h].pos._z))
      }
      area += (vertices[0].pos._y * (vertices[1].pos._z - vertices[n - 1].pos._z))
    // scale to get area
      area *= (an / (2 * normal._x))
      break

    case 2: // ignore Y coordinates
    // compute area of 2D projection
      for (i = 1; i < n; i++) {
        h = i - 1
        j = (i + 1) % n
        area += (vertices[i].pos._z * (vertices[j].pos._x - vertices[h].pos._x))
      }
      area += (vertices[0].pos._z * (vertices[1].pos._x - vertices[n - 1].pos._x))
    // scale to get area
      area *= (an / (2 * normal._y))
      break

    case 3: // ignore Z coordinates
    // compute area of 2D projection
      for (i = 1; i < n; i++) {
        h = i - 1
        j = (i + 1) % n
        area += (vertices[i].pos._x * (vertices[j].pos._y - vertices[h].pos._y))
      }
      area += (vertices[0].pos._x * (vertices[1].pos._y - vertices[n - 1].pos._y))
    // scale to get area
      area *= (an / (2 * normal._z))
      break
  }
  return area
}

module.exports = measureArea
