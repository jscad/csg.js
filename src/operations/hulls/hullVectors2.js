const { vec2 } = require('../../math')

const angleBetweenPoints = (p0, p1) => {
  return Math.atan2((p1[1] - p0[1]), (p1[0] - p0[0]))
}

const compareIndex = (index1, index2) => {
  if (index1.angle < index2.angle) {
    return -1
  } else if (index1.angle > index2.angle) {
    return 1
  } else {
    if (index1.distance < index2.distance) {
      return -1
    } else if (index1.distance > index2.distance) {
      return 1
    }
  }
  return 0
}

// Ported from https://github.com/bkiers/GrahamScan
const compute = (vectors) => {
  if (vectors.length < 3) {
    return null
  }

  // Find the lowest point
  let min = 0
  vectors.forEach((point, i) => {
    let minpoint = vectors[min]
    if (point[1] === minpoint[1]) {
      if (point[0] < minpoint[0]) {
        min = i
      }
    } else if (point[1] < minpoint[1]) {
      min = i
    }
  })

  // Calculate angles and distances from the lowest point
  let al = []
  let angle = 0.0
  let dist = 0.0
  for (let i = 0; i < vectors.length; i++) {
    if (i === min) {
      continue
    }
    angle = angleBetweenPoints(vectors[min], vectors[i])
    if (angle < 0) {
      angle += Math.PI
    }
    dist = vec2.squaredDistance(vectors[min], vectors[i])
    al.push({ index: i, angle: angle, distance: dist })
  }

  al.sort(function (a, b) { return compareIndex(a, b) })

  // Wind around the vectors CCW, removing interior vectors
  let stack = new Array(vectors.length + 1)
  let j = 2
  for (let i = 0; i < vectors.length; i++) {
    if (i === min) {
      continue
    }
    stack[j] = al[j - 2].index
    j++
  }
  stack[0] = stack[vectors.length]
  stack[1] = min

  const ccw = (i1, i2, i3) => {
    return (vectors[i2][0] - vectors[i1][0]) * (vectors[i3][1] - vectors[i1][1]) -
           (vectors[i2][1] - vectors[i1][1]) * (vectors[i3][0] - vectors[i1][0])
  }

  let tmp
  let M = 2
  for (let i = 3; i <= vectors.length; i++) {
    while (ccw(stack[M - 1], stack[M], stack[i]) < 1e-5) {
      M--
    }
    M++
    tmp = stack[i]
    stack[i] = stack[M]
    stack[M] = tmp
  }

  // Return the indices to the vectors
  const indices = new Array(M)
  for (let i = 0; i < M; i++) {
    indices[i] = stack[i + 1]
  }
  return indices
}

/** Create a convex hull of the given set of vectors,  where each vector is an array of [x,y].
 * @param {Array} uniquevectors - list of UNIQUE vectors from which to create a hull
 * @returns {Array} a list of vectors that form the hull
 */
const hullVectors2 = (uniquevectors) => {
  let indices = compute(uniquevectors)

  let hullvectors = []
  if (Array.isArray(indices)) {
    hullvectors = indices.map((index) => uniquevectors[index])
  }
  return hullvectors
}

module.exports = hullVectors2
