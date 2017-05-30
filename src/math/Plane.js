const Vector3D = require('./Vector3')
const Vertex = require('./Vertex3')
const Polygon = require('./Polygon')
const Line3D = require('./Line3D')
const {EPS, getTag} = require('../constants')

// # class Plane
// Represents a plane in 3D space.
const Plane = function (normal, w) {
  this.normal = normal
  this.w = w
}

// create from an untyped object with identical property names:
Plane.fromObject = function (obj) {
  let normal = new Vector3D(obj.normal)
  let w = parseFloat(obj.w)
  return new Plane(normal, w)
}

Plane.fromVector3Ds = function (a, b, c) {
  let n = b.minus(a).cross(c.minus(a)).unit()
  return new Plane(n, n.dot(a))
}

// like fromVector3Ds, but allow the vectors to be on one point or one line
// in such a case a random plane through the given points is constructed
Plane.anyPlaneFromVector3Ds = function (a, b, c) {
  let v1 = b.minus(a)
  let v2 = c.minus(a)
  if (v1.length() < EPS) {
    v1 = v2.randomNonParallelVector()
  }
  if (v2.length() < EPS) {
    v2 = v1.randomNonParallelVector()
  }
  let normal = v1.cross(v2)
  if (normal.length() < EPS) {
        // this would mean that v1 == v2.negated()
    v2 = v1.randomNonParallelVector()
    normal = v1.cross(v2)
  }
  normal = normal.unit()
  return new Plane(normal, normal.dot(a))
}

Plane.fromPoints = function (a, b, c) {
  a = new Vector3D(a)
  b = new Vector3D(b)
  c = new Vector3D(c)
  return Plane.fromVector3Ds(a, b, c)
}

Plane.fromNormalAndPoint = function (normal, point) {
  normal = new Vector3D(normal)
  point = new Vector3D(point)
  normal = normal.unit()
  let w = point.dot(normal)
  return new Plane(normal, w)
}

Plane.prototype = {
  flipped: function () {
    return new Plane(this.normal.negated(), -this.w)
  },

  getTag: function () {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  },

  equals: function (n) {
    return this.normal.equals(n.normal) && this.w === n.w
  },

  transform: function (matrix4x4) {
    let ismirror = matrix4x4.isMirroring()
        // get two vectors in the plane:
    let r = this.normal.randomNonParallelVector()
    let u = this.normal.cross(r)
    let v = this.normal.cross(u)
        // get 3 points in the plane:
    let point1 = this.normal.times(this.w)
    let point2 = point1.plus(u)
    let point3 = point1.plus(v)
        // transform the points:
    point1 = point1.multiply4x4(matrix4x4)
    point2 = point2.multiply4x4(matrix4x4)
    point3 = point3.multiply4x4(matrix4x4)
        // and create a new plane from the transformed points:
    let newplane = Plane.fromVector3Ds(point1, point2, point3)
    if (ismirror) {
            // the transform is mirroring
            // We should mirror the plane:
      newplane = newplane.flipped()
    }
    return newplane
  },

    // Returns object:
    // .type:
    //   0: coplanar-front
    //   1: coplanar-back
    //   2: front
    //   3: back
    //   4: spanning
    // In case the polygon is spanning, returns:
    // .front: a Polygon of the front part
    // .back: a Polygon of the back part
  splitPolygon: function (polygon) {
    let result = {
      type: null,
      front: null,
      back: null
    }
        // cache in local lets (speedup):
    let planenormal = this.normal
    let vertices = polygon.vertices
    let numvertices = vertices.length
    if (polygon.plane.equals(this)) {
      result.type = 0
    } else {
      let thisw = this.w
      let hasfront = false
      let hasback = false
      let vertexIsBack = []
      let MINEPS = -EPS
      for (let i = 0; i < numvertices; i++) {
        let t = planenormal.dot(vertices[i].pos) - thisw
        let isback = (t < 0)
        vertexIsBack.push(isback)
        if (t > EPS) hasfront = true
        if (t < MINEPS) hasback = true
      }
      if ((!hasfront) && (!hasback)) {
                // all points coplanar
        let t = planenormal.dot(polygon.plane.normal)
        result.type = (t >= 0) ? 0 : 1
      } else if (!hasback) {
        result.type = 2
      } else if (!hasfront) {
        result.type = 3
      } else {
                // spanning
        result.type = 4
        let frontvertices = []
        let backvertices = []
        let isback = vertexIsBack[0]
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          let vertex = vertices[vertexindex]
          let nextvertexindex = vertexindex + 1
          if (nextvertexindex >= numvertices) nextvertexindex = 0
          let nextisback = vertexIsBack[nextvertexindex]
          if (isback === nextisback) {
                        // line segment is on one side of the plane:
            if (isback) {
              backvertices.push(vertex)
            } else {
              frontvertices.push(vertex)
            }
          } else {
                        // line segment intersects plane:
            let point = vertex.pos
            let nextpoint = vertices[nextvertexindex].pos
            let intersectionpoint = this.splitLineBetweenPoints(point, nextpoint)
            let intersectionvertex = new Vertex(intersectionpoint)
            if (isback) {
              backvertices.push(vertex)
              backvertices.push(intersectionvertex)
              frontvertices.push(intersectionvertex)
            } else {
              frontvertices.push(vertex)
              frontvertices.push(intersectionvertex)
              backvertices.push(intersectionvertex)
            }
          }
          isback = nextisback
        } // for vertexindex
                // remove duplicate vertices:
        let EPS_SQUARED = EPS * EPS
        if (backvertices.length >= 3) {
          let prevvertex = backvertices[backvertices.length - 1]
          for (let vertexindex = 0; vertexindex < backvertices.length; vertexindex++) {
            let vertex = backvertices[vertexindex]
            if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
              backvertices.splice(vertexindex, 1)
              vertexindex--
            }
            prevvertex = vertex
          }
        }
        if (frontvertices.length >= 3) {
          let prevvertex = frontvertices[frontvertices.length - 1]
          for (let vertexindex = 0; vertexindex < frontvertices.length; vertexindex++) {
            let vertex = frontvertices[vertexindex]
            if (vertex.pos.distanceToSquared(prevvertex.pos) < EPS_SQUARED) {
              frontvertices.splice(vertexindex, 1)
              vertexindex--
            }
            prevvertex = vertex
          }
        }
        if (frontvertices.length >= 3) {
          result.front = new Polygon(frontvertices, polygon.shared, polygon.plane)
        }
        if (backvertices.length >= 3) {
          result.back = new Polygon(backvertices, polygon.shared, polygon.plane)
        }
      }
    }
    return result
  },

    // robust splitting of a line by a plane
    // will work even if the line is parallel to the plane
  splitLineBetweenPoints: function (p1, p2) {
    let direction = p2.minus(p1)
    let labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction)
    if (isNaN(labda)) labda = 0
    if (labda > 1) labda = 1
    if (labda < 0) labda = 0
    let result = p1.plus(direction.times(labda))
    return result
  },

    // returns Vector3D
  intersectWithLine: function (line3d) {
    return line3d.intersectWithPlane(this)
  },

    // intersection of two planes
  intersectWithPlane: function (plane) {
    return Line3D.fromPlanes(this, plane)
  },

  signedDistanceToPoint: function (point) {
    let t = this.normal.dot(point) - this.w
    return t
  },

  toString: function () {
    return '[normal: ' + this.normal.toString() + ', w: ' + this.w + ']'
  },

  mirrorPoint: function (point3d) {
    let distance = this.signedDistanceToPoint(point3d)
    let mirrored = point3d.minus(this.normal.times(distance * 2.0))
    return mirrored
  }
}

module.exports = Plane
