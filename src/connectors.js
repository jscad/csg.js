// ////////////////////////////////////
// # class Connector
// A connector allows to attach two objects at predefined positions
// For example a servo motor and a servo horn:
// Both can have a Connector called 'shaft'
// The horn can be moved and rotated such that the two connectors match
// and the horn is attached to the servo motor at the proper position.
// Connectors are stored in the properties of a CSG solid so they are
// ge the same transformations applied as the solid
CSG.Connector = function (point, axisvector, normalvector) {
  this.point = new CSG.Vector3D(point)
  this.axisvector = new CSG.Vector3D(axisvector).unit()
  this.normalvector = new CSG.Vector3D(normalvector).unit()
}

CSG.Connector.prototype = {
  normalized: function () {
    var axisvector = this.axisvector.unit()
        // make the normal vector truly normal:
    var n = this.normalvector.cross(axisvector).unit()
    var normalvector = axisvector.cross(n)
    return new CSG.Connector(this.point, axisvector, normalvector)
  },

  transform: function (matrix4x4) {
    var point = this.point.multiply4x4(matrix4x4)
    var axisvector = this.point.plus(this.axisvector).multiply4x4(matrix4x4).minus(point)
    var normalvector = this.point.plus(this.normalvector).multiply4x4(matrix4x4).minus(point)
    return new CSG.Connector(point, axisvector, normalvector)
  },

    // Get the transformation matrix to connect this Connector to another connector
    //   other: a CSG.Connector to which this connector should be connected
    //   mirror: false: the 'axis' vectors of the connectors should point in the same direction
    //           true: the 'axis' vectors of the connectors should point in opposite direction
    //   normalrotation: degrees of rotation between the 'normal' vectors of the two
    //                   connectors
  getTransformationTo: function (other, mirror, normalrotation) {
    mirror = mirror ? true : false
    normalrotation = normalrotation ? Number(normalrotation) : 0
    var us = this.normalized()
    other = other.normalized()
        // shift to the origin:
    var transformation = CSG.Matrix4x4.translation(this.point.negated())
        // construct the plane crossing through the origin and the two axes:
    var axesplane = CSG.Plane.anyPlaneFromVector3Ds(
            new CSG.Vector3D(0, 0, 0), us.axisvector, other.axisvector)
    var axesbasis = new CSG.OrthoNormalBasis(axesplane)
    var angle1 = axesbasis.to2D(us.axisvector).angle()
    var angle2 = axesbasis.to2D(other.axisvector).angle()
    var rotation = 180.0 * (angle2 - angle1) / Math.PI
    if (mirror) rotation += 180.0
    transformation = transformation.multiply(axesbasis.getProjectionMatrix())
    transformation = transformation.multiply(CSG.Matrix4x4.rotationZ(rotation))
    transformation = transformation.multiply(axesbasis.getInverseProjectionMatrix())
    var usAxesAligned = us.transform(transformation)
        // Now we have done the transformation for aligning the axes.
        // We still need to align the normals:
    var normalsplane = CSG.Plane.fromNormalAndPoint(other.axisvector, new CSG.Vector3D(0, 0, 0))
    var normalsbasis = new CSG.OrthoNormalBasis(normalsplane)
    angle1 = normalsbasis.to2D(usAxesAligned.normalvector).angle()
    angle2 = normalsbasis.to2D(other.normalvector).angle()
    rotation = 180.0 * (angle2 - angle1) / Math.PI
    rotation += normalrotation
    transformation = transformation.multiply(normalsbasis.getProjectionMatrix())
    transformation = transformation.multiply(CSG.Matrix4x4.rotationZ(rotation))
    transformation = transformation.multiply(normalsbasis.getInverseProjectionMatrix())
        // and translate to the destination point:
    transformation = transformation.multiply(CSG.Matrix4x4.translation(other.point))
        // var usAligned = us.transform(transformation);
    return transformation
  },

  axisLine: function () {
    return new CSG.Line3D(this.point, this.axisvector)
  },

    // creates a new Connector, with the connection point moved in the direction of the axisvector
  extend: function (distance) {
    var newpoint = this.point.plus(this.axisvector.unit().times(distance))
    return new CSG.Connector(newpoint, this.axisvector, this.normalvector)
  }
}

CSG.ConnectorList = function (connectors) {
  this.connectors_ = connectors ? connectors.slice() : []
}

CSG.ConnectorList.defaultNormal = [0, 0, 1]

CSG.ConnectorList.fromPath2D = function (path2D, arg1, arg2) {
  if (arguments.length === 3) {
    return CSG.ConnectorList._fromPath2DTangents(path2D, arg1, arg2)
  } else if (arguments.length == 2) {
    return CSG.ConnectorList._fromPath2DExplicit(path2D, arg1)
  } else {
    throw ('call with path2D and either 2 direction vectors, or a function returning direction vectors')
  }
}

/*
 * calculate the connector axisvectors by calculating the "tangent" for path2D.
 * This is undefined for start and end points, so axis for these have to be manually
 * provided.
 */
CSG.ConnectorList._fromPath2DTangents = function (path2D, start, end) {
    // path2D
  var axis
  var pathLen = path2D.points.length
  var result = new CSG.ConnectorList([new CSG.Connector(path2D.points[0],
        start, CSG.ConnectorList.defaultNormal)])
    // middle points
  path2D.points.slice(1, pathLen - 1).forEach(function (p2, i) {
    axis = path2D.points[i + 2].minus(path2D.points[i]).toVector3D(0)
    result.appendConnector(new CSG.Connector(p2.toVector3D(0), axis,
          CSG.ConnectorList.defaultNormal))
  }, this)
  result.appendConnector(new CSG.Connector(path2D.points[pathLen - 1], end,
      CSG.ConnectorList.defaultNormal))
  result.closed = path2D.closed
  return result
}

/*
 * angleIsh: either a static angle, or a function(point) returning an angle
 */
CSG.ConnectorList._fromPath2DExplicit = function (path2D, angleIsh) {
  function getAngle (angleIsh, pt, i) {
    if (typeof angleIsh === 'function') {
      angleIsh = angleIsh(pt, i)
    }
    return angleIsh
  }
  var result = new CSG.ConnectorList(
        path2D.points.map(function (p2, i) {
          return new CSG.Connector(p2.toVector3D(0),
                CSG.Vector3D.Create(1, 0, 0).rotateZ(getAngle(angleIsh, p2, i)),
                  CSG.ConnectorList.defaultNormal)
        }, this)
    )
  result.closed = path2D.closed
  return result
}

CSG.ConnectorList.prototype = {
  setClosed: function (bool) {
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
    this.verify()
    function getCag (cagish, connector) {
      if (typeof cagish === 'function') {
        cagish = cagish(connector.point, connector.axisvector, connector.normalvector)
      }
      return cagish
    }

    var polygons = [], currCag
    var prevConnector = this.connectors_[this.connectors_.length - 1]
    var prevCag = getCag(cagish, prevConnector)
        // add walls
    this.connectors_.forEach(function (connector, notFirst) {
      currCag = getCag(cagish, connector)
      if (notFirst || this.closed) {
        polygons.push.apply(polygons, prevCag._toWallPolygons({
          toConnector1: prevConnector, toConnector2: connector, cag: currCag}))
      } else {
                // it is the first, and shape not closed -> build start wall
        polygons.push.apply(polygons,
                    currCag._toPlanePolygons({toConnector: connector, flipped: true}))
      }
      if (notFirst == this.connectors_.length - 1 && !this.closed) {
                // build end wall
        polygons.push.apply(polygons,
                    currCag._toPlanePolygons({toConnector: connector}))
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
    var connI, connI1, dPosToAxis, axisToNextAxis
    for (var i = 0; i < this.connectors_.length - 1; i++) {
      connI = this.connectors_[i], connI1 = this.connectors_[i + 1]
      if (connI1.point.minus(connI.point).dot(connI.axisvector) <= 0) {
        throw ('Invalid ConnectorList. Each connectors position needs to be within a <90deg range of previous connectors axisvector')
      }
      if (connI.axisvector.dot(connI1.axisvector) <= 0) {
        throw ('invalid ConnectorList. No neighboring connectors axisvectors may span a >=90deg angle')
      }
    }
  }
}
