const vec3 = require('../../math/vec3')

// measure the area of the given poly3 (3D planar polygon)
// translated from the orginal C++ code from Dan Sunday
// 2000 softSurfer http://geomalgorithms.com
const measureArea = (poly3) => {
  let n = poly3.vectors.length
  if (n < 3) {
    return 0 // degenerate polygon
  }
  let vectors = poly3.vectors

// calculate a real normal
  let a = vectors[0]
  let b = vectors[1]
  let c = vectors[2]
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
        area += (vectors[i][1] * (vectors[j][2] - vectors[h][2]))
      }
      area += (vectors[0][1] * (vectors[1][2] - vectors[n - 1][2]))
    // scale to get area
      area *= (an / (2 * normal._x))
      break

    case 2: // ignore Y coordinates
    // compute area of 2D projection
      for (i = 1; i < n; i++) {
        h = i - 1
        j = (i + 1) % n
        area += (vectors[i][2] * (vectors[j][0] - vectors[h][0]))
      }
      area += (vectors[0][2] * (vectors[1][0] - vectors[n - 1][0]))
    // scale to get area
      area *= (an / (2 * normal._y))
      break

    case 3: // ignore Z coordinates
    // compute area of 2D projection
      for (i = 1; i < n; i++) {
        h = i - 1
        j = (i + 1) % n
        area += (vectors[i][0] * (vectors[j][1] - vectors[h][1]))
      }
      area += (vectors[0][0] * (vectors[1][1] - vectors[n - 1][1]))
    // scale to get area
      area *= (an / (2 * normal._z))
      break
  }
  return area
}

// Note: could calculate vectors only once to speed up
// FIXME: use a pipe operator to simplify vec3 operations
const measureArea2 = (poly3) => {
  let polygonArea = 0
  for (let i = 0; i < poly3.vectors.length - 2; i++) {
    polygonArea += vec3.length(
        vec3.cross(
          vec3.subtract(poly3.vectors[i + 1], poly3.vectors[0]),
          vec3.subtract(poly3.vectors[i + 2], poly3.vectors[i + 1])
      )
    )
  }
  polygonArea *= 0.5
  return polygonArea
}

module.exports = measureArea
