const mat4 = require('./math/mat4')
const vec3 = require('./math/vec3')

const Vector3D = require('./math/Vector3')
const Line3D = require('./math/Line3')
const Matrix4x4 = require('./math/Matrix4')
const OrthoNormalBasis = require('./math/OrthoNormalBasis')
const Plane = require('./math/Plane')
const { fromVector2 } = require('./math/Vector3Factories')

// A connector allows to attach two objects at predefined positions
// For example a servo motor and a servo horn:
// Both can have a Connector called 'shaft'
// The horn can be moved and rotated such that the two connectors match
// and the horn is attached to the servo motor at the proper position.
// Connectors are stored in the properties of a CSG solid so they are
// get the same transformations applied as the solid
const create = () => {
  return {
    point: vec3.create(),
    axis: vec3.unit(vec3.create()),
    normal: vec3.unit(vec3.create())
  }
}
const fromPointAxisNormal = (point, axis, normal) => {
  return {
    point,
    axis: vec3.unit(axis),
    normal: vec3.unit(normal)
  }
}

/** Transform a connector by a 4x4 matrix
 * @param {Mat4} matrix a 4x4 connector
 * @param {Connector} connector the connector to transform
 * @returns {Connector} a normalized connector
 */
const transform = (matrix, connector) => {
  const point = vec3.transform(matrix, connector.point)
  const axis = vec3.subtract(
    vec3.transform(
      matrix,
      vec3.add(connector.point, connector.axis)
    ),
    point
  )
  const normal = vec3.subtract(
    vec3.transform(
      matrix,
      vec3.add(connector.point, connector.normal)
    ),
    point)
  return fromPointAxisNormal(point, axis, normal)
}

/** Creates a new Connector, with normalized data
 * @param {Connector} connector the connector to normalize
 * @returns {Connector} a normalized connector
 */
const normalize = connector => {
  const axis = vec3.unit(connector.axis)
  // make the normal vector truly normal:
  const realNormal = vec3.unit(
    vec3.cross(connector.normal, connector.axis)
  )
  const normal = vec3.cross(axis, realNormal)
  return fromPointAxisNormal(connector.point, axis, normal)
}

/** Creates a new Connector, with the connection point moved in the direction of the axisvector
 * @returns {Connector} a normalized connector
 */
const extend = (distance, connector) => {
  const newpoint = vec3.add(connector.point, vec3.scale(vec3.unit(connector.axis)))
  return fromPointAxisNormal(newpoint, connector.axis, connector.normal)
}

/** Get the transformation matrix to connect this Connector to another connector
 * @param {Object} params
 * @param  {Boolean} params.mirror=false the 'axis' vectors of the connectors should point in the same direction
 *  true: the 'axis' vectors of the connectors should point in opposite direction
 * @param {Number} params.normalrotation=0 : degrees of rotation between the 'normal' vectors of the two connectors
 * @param  {Connector} from connector from which to connect
 * @param  {Connector} to connector to which the first connector should be connected
 */
const transformationFromTo = (params, from, to) => {
  const defaults = {
    mirror: false,
    normalrotation: 0
  }
  mirror = !!mirror
  normalrotation = normalrotation ? Number(normalrotation) : 0
  let us = this.normalized()
  other = other.normalized()
  // shift to the origin:
  let transformation = Matrix4x4.translation(this.point.negated())
  // construct the plane crossing through the origin and the two axes:
  let axesplane = Plane.anyPlaneFromVector3Ds(
    new Vector3D(0, 0, 0), us.axisvector, other.axisvector)
  let axesbasis = new OrthoNormalBasis(axesplane)
  let angle1 = axesbasis.to2D(us.axisvector).angle()
  let angle2 = axesbasis.to2D(other.axisvector).angle()
  let rotation = 180.0 * (angle2 - angle1) / Math.PI
  if (mirror) rotation += 180.0
  transformation = transformation.multiply(axesbasis.getProjectionMatrix())
  transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
  transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix())
  let usAxesAligned = us.transform(transformation)
  // Now we have done the transformation for aligning the axes.
  // We still need to align the normals:
  let normalsplane = Plane.fromNormalAndPoint(other.axisvector, new Vector3D(0, 0, 0))
  let normalsbasis = new OrthoNormalBasis(normalsplane)
  angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle()
  angle2 = normalsbasis.to2D(other.normalvector).angle()
  rotation = 180.0 * (angle2 - angle1) / Math.PI
  rotation += normalrotation
  transformation = transformation.multiply(normalsbasis.getProjectionMatrix())
  transformation = transformation.multiply(Matrix4x4.rotationZ(rotation))
  transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix())
  // and translate to the destination point:
  transformation = transformation.multiply(Matrix4x4.translation(other.point))
  // let usAligned = us.transform(transformation);
  return transformation
}

// FIXME: is this usefull as part of core, or purely visual ?
/* axisLine: function () {
  return new Line3D(this.point, this.axisvector)
} */

// # class Connector

const ConnectorList = function (connectors) {
  this.connectors_ = connectors ? connectors.slice() : []
}

ConnectorList.defaultNormal = [0, 0, 1]

ConnectorList.fromPath2D = function (path2D, arg1, arg2) {
  if (arguments.length === 3) {
    return ConnectorList._fromPath2DTangents(path2D, arg1, arg2)
  } else if (arguments.length === 2) {
    return ConnectorList._fromPath2DExplicit(path2D, arg1)
  } else {
    throw new Error('call with path2D and either 2 direction vectors, or a function returning direction vectors')
  }
}

/*
 * calculate the connector axisvectors by calculating the "tangent" for path2D.
 * This is undefined for start and end points, so axis for these have to be manually
 * provided.
 */
ConnectorList._fromPath2DTangents = function (path2D, start, end) {
  // path2D
  let axis
  let pathLen = path2D.points.length
  let result = new ConnectorList([new Connector(path2D.points[0],
    start, ConnectorList.defaultNormal)])
  // middle points
  path2D.points.slice(1, pathLen - 1).forEach(function (p2, i) {
    axis = fromVector2(path2D.points[i + 2].minus(path2D.points[i]), 0)
    result.appendConnector(new Connector(fromVector2(p2, 0), axis,
      ConnectorList.defaultNormal))
  }, this)
  result.appendConnector(new Connector(path2D.points[pathLen - 1], end,
    ConnectorList.defaultNormal))
  result.closed = path2D.closed
  return result
}

/*
 * angleIsh: either a static angle, or a function(point) returning an angle
 */
ConnectorList._fromPath2DExplicit = function (path2D, angleIsh) {
  function getAngle (angleIsh, pt, i) {
    if (typeof angleIsh === 'function') {
      angleIsh = angleIsh(pt, i)
    }
    return angleIsh
  }
  let result = new ConnectorList(
    path2D.points.map(function (p2, i) {
      return new Connector(fromVector2(p2, 0),
        Vector3D.Create(1, 0, 0).rotateZ(getAngle(angleIsh, p2, i)),
        ConnectorList.defaultNormal)
    }, this)
  )
  result.closed = path2D.closed
  return result
}

ConnectorList.prototype = {
  setClosed: function (closed) {
    this.closed = !!closed
  },
  appendConnector: function (conn) {
    this.connectors_.push(conn)
  },
  /*
     * arguments: cagish: a cag or a function(connector) returning a cag
     *            closed: whether the 3d path defined by connectors location
     *              should be closed or stay open
     *              Note: don't duplicate connectors in the path
     * TODO: consider an option "maySelfIntersect" to close & force union all single segments
     */
  followWith: function (cagish) {
    const CSG = require('./CSG') // FIXME , circular dependency connectors => CSG => connectors

    this.verify()
    function getCag (cagish, connector) {
      if (typeof cagish === 'function') {
        cagish = cagish(connector.point, connector.axisvector, connector.normalvector)
      }
      return cagish
    }

    let polygons = []
    let currCag
    let prevConnector = this.connectors_[this.connectors_.length - 1]
    let prevCag = getCag(cagish, prevConnector)
    // add walls
    this.connectors_.forEach(function (connector, notFirst) {
      currCag = getCag(cagish, connector)
      if (notFirst || this.closed) {
        polygons.push.apply(polygons, prevCag._toWallPolygons({
          toConnector1: prevConnector, toConnector2: connector, cag: currCag }))
      } else {
        // it is the first, and shape not closed -> build start wall
        polygons.push.apply(polygons,
          currCag._toPlanePolygons({ toConnector: connector, flipped: true }))
      }
      if (notFirst === this.connectors_.length - 1 && !this.closed) {
        // build end wall
        polygons.push.apply(polygons,
          currCag._toPlanePolygons({ toConnector: connector }))
      }
      prevCag = currCag
      prevConnector = connector
    }, this)
    return CSG.fromPolygons(polygons).reTesselated().canonicalized()
  },
  /*
     * general idea behind these checks: connectors need to have smooth transition from one to another
     * TODO: add a check that 2 follow-on CAGs are not intersecting
     */
  verify: function () {
    let connI
    let connI1
    for (let i = 0; i < this.connectors_.length - 1; i++) {
      connI = this.connectors_[i]
      connI1 = this.connectors_[i + 1]
      if (connI1.point.minus(connI.point).dot(connI.axisvector) <= 0) {
        throw new Error('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axisvector')
      }
      if (connI.axisvector.dot(connI1.axisvector) <= 0) {
        throw new Error('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle')
      }
    }
  }
}

module.exports = { Connector, ConnectorList }
