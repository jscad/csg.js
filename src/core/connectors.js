const mat4 = require('./math/mat4')
const vec2 = require('./math/vec2')
const vec3 = require('./math/vec3')
const plane = require('./math/plane/')
const OrthoNormalBasis = require('./math/OrthoNormalBasis')

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

/** Creates a new Connector, with the connection point moved in the direction of the axis
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
const transformationBetweenConnectors = (params, from, to) => {
  const defaults = {
    mirror: false,
    normalrotation: 0
  }
  // mirror = !!mirror
  // normalrotation = normalrotation ? Number(normalrotation) : 0
  const { mirror, normalrotation } = Object.assign({}, defaults, params)
  const us = normalize(from)
  const other = normalize(to)
  // shift to the origin:
  let transformation = mat4.fromTranslation(vec3.negate(from.point))
  // construct the plane crossing through the origin and the two axes:
  let axesplane = plane.fromPointsRandom(vec3.create(), us.axis, other.axis)
  let axesbasis = new OrthoNormalBasis(axesplane)

  let angle1 = vec2.angleRadians(axesbasis.to2D(us.axis))
  let angle2 = vec2.angleRadians(axesbasis.to2D(other.axis))
  let rotation = 180.0 * (angle2 - angle1) / Math.PI // TODO: switch back to radians
  if (mirror) rotation += 180.0
  // TODO: understand and explain this
  transformation = mat4.multiply(transformation, axesbasis.getProjectionMatrix())
  transformation = mat4.multiply(transformation, mat4.fromZRotation(rotation))
  transformation = mat4.multiply(transformation, axesbasis.getInverseProjectionMatrix())
  let usAxesAligned = transform(transformation, us)
  // Now we have done the transformation for aligning the axes.
  // We still need to align the normals:
  let normalsplane = plane.fromNormalAndPoint(other.axis, vec3.create())
  let normalsbasis = new OrthoNormalBasis(normalsplane)
  angle1 = vec2.angleRadians(normalsbasis.to2D(usAxesAligned.normal))
  angle2 = vec2.angleRadians(normalsbasis.to2D(other.normal))
  rotation = 180.0 * (angle2 - angle1) / Math.PI
  rotation += normalrotation
  transformation = mat4.multiply(transformation, normalsbasis.getProjectionMatrix())
  transformation = mat4.multiply(transformation, mat4.fromZRotation(rotation))
  transformation = mat4.multiply(transformation, normalsbasis.getInverseProjectionMatrix())
  // and translate to the destination point:
  transformation = mat4.multiply(transformation, mat4.fromTranslation(other.point))
  // let usAligned = us.transform(transformation);
  return transformation
}

// FIXME: is this usefull as part of core, or purely visual ?
/* axisLine: function () {
  return new Line3D(this.point, this.axis)
} */

// old 'connectors list' for now only array of connectors

const fromPath2 = (path, arg1, arg2) => {
  if (arguments.length === 3) {
    return fromPath2Tangents(path, arg1, arg2)
  } else if (arguments.length === 2) {
    return fromPath2AndAngle(path, arg1)
  } else {
    throw new Error('FromPath2 requires either a path and 2 direction vectors, or a function returning direction vectors')
  }
}

/*
 * calculate the connector axisvectors by calculating the "tangent" for path.
 * This is undefined for start and end points, so axis for these have to be manually
 * provided.
 */
const fromPath2Tangents = (path, start, end) => {
  const defaultNormal = [0, 0, 1]
  // path
  let axis
  let pathLen = path.points.length
  let result = [
    fromPointAxisNormal(path.points[0], start, defaultNormal)]
  // middle points
  path.points.slice(1, pathLen - 1).forEach((p2, i) => {
    axis = vec3.fromVec2(vec2.subtract(path.points[i + 2], path.points[i]))
    result.push(fromPointAxisNormal(vec3.fromVec2(p2), axis, defaultNormal))
  }, this)
  // other points
  result.push(fromPointAxisNormal(path.points[pathLen - 1], end, defaultNormal))
  // result.closed = path.closed // FIXME: meh, do we still need this ??
  return result
}

/*
 * angleIsh: either a static angle, or a function(point) returning an angle
 */
const fromPath2AndAngle = (path, angleIsh) => {
  const defaultNormal = [0, 0, 1]
  const getAngle = (angleIsh, pt, i) => {
    if (typeof angleIsh === 'function') {
      angleIsh = angleIsh(pt, i)
    }
    return angleIsh
  }
  let result = path.points.map((p2, i) => {
    const axis = vec3.rotateZ(getAngle(angleIsh, p2, i), vec3.fromValues(1, 0, 0))
    return fromPointAxisNormal(vec3.fromVec2(p2), axis, defaultNormal)
  })
  // result.closed = path.closed // FIXME: meh, do we still need this ??
  return result
}

const verify = connectors => {
  let connI
  let connI1
  for (let i = 0; i < connectors.length - 1; i++) {
    connI = connectors[i]
    connI1 = connectors[i + 1]
    if (connI1.point.minus(connI.point).dot(connI.axis) <= 0) {
      throw new Error('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axis')
    }
    if (connI.axis.dot(connI1.axis) <= 0) {
      throw new Error('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle')
    }
  }
}

ConnectorList.prototype = {
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
        cagish = cagish(connector.point, connector.axis, connector.normal)
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
  }
  /*
     * general idea behind these checks: connectors need to have smooth transition from one to another
     * TODO: add a check that 2 follow-on CAGs are not intersecting
     */

}

module.exports = { Connector, ConnectorList }
