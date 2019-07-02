const { vec2 } = require('../../math')

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
const ConvexHull = function () {
  this.points = null
  this.indices = null

  this.getIndices = function () {
    return this.indices
  }

  this.clear = function () {
    this.indices = null
    this.points = null
  }

  this.ccw = function (p1, p2, p3) {
    let ccw = (this.points[p2][0] - this.points[p1][0]) * (this.points[p3][1] - this.points[p1][1]) -
                   (this.points[p2][1] - this.points[p1][1]) * (this.points[p3][0] - this.points[p1][0])
    // we need this, otherwise sorting never ends, see https://github.com/Spiritdude/OpenJSCAD.org/issues/18
    if (ccw < 1e-5) {
      return 0
    }
    return ccw
  }

  this.angle = function (o, a) {
    return Math.atan2((this.points[a][1] - this.points[o][1]), (this.points[a][0] - this.points[o][0]))
  }

  this.distance = function (a, b) {
    return ((this.points[b][0] - this.points[a][0]) * (this.points[b][0] - this.points[a][0]) +
                 (this.points[b][1] - this.points[a][1]) * (this.points[b][1] - this.points[a][1]))
  }

  this.compute = function (_points) {
    this.indices = null
    if (_points.length < 3) {
      return
    }
    this.points = _points

    // Find the lowest point
    let min = 0
    this.points.forEach((point, i) => {
      let minpoint = this.points[min]
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
    for (let i = 0; i < this.points.length; i++) {
      if (i === min) {
        continue
      }
      angle = this.angle(min, i)
      if (angle < 0) {
        angle += Math.PI
      }
      dist = this.distance(min, i)
      al.push({ index: i, angle: angle, distance: dist })
    }

    al.sort(function (a, b) { return compareIndex(a, b) })

    // Wind around the points CCW, removing interior points
    let stack = new Array(this.points.length + 1)
    let j = 2
    for (let i = 0; i < this.points.length; i++) {
      if (i === min) {
        continue
      }
      stack[j] = al[j - 2].index
      j++
    }
    stack[0] = stack[this.points.length]
    stack[1] = min

    let tmp
    let M = 2
    for (let i = 3; i <= this.points.length; i++) {
      while (this.ccw(stack[M - 1], stack[M], stack[i]) <= 0) {
        M--
      }
      M++
      tmp = stack[i]
      stack[i] = stack[M]
      stack[M] = tmp
    }

    // Retain the indices to the points
    this.indices = new Array(M)
    for (let i = 0; i < M; i++) {
      this.indices[i] = stack[i + 1]
    }
  }
}

/** Create a convex hull of the given points (2D vectors).
 * @param {[vec2]} uniquepoints - list of UNIQUE points from which to create a hull
 * @returns {[vec2]} points of the resulting hull
 */
const hull2DPoints = (uniquepoints) => {
  const hull = new ConvexHull()
  hull.compute(uniquepoints)

  let indices = hull.getIndices()
  let hullpoints = []
  if (Array.isArray(indices)) {
    hullpoints = indices.map((index) => uniquepoints[index])
  }
  return hullpoints
}

module.exports = hull2DPoints
