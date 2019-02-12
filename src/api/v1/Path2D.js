const buildCircleArc = require('../../algorithm/arc/buildCircleArc')
const buildSvgArc = require('../../algorithm/arc/buildSvgArc')
const { angleEPS, X, Y } = require('./constants')
const call = require('../registry/call')
const vec2 = require('../../math/vec2')
const defaultPathGeometry = require('./defaultPathGeometry')

class Path2D {
  constructor(points, closed, geometry) {
    if (geometry !== undefined) {
      this.geometry = geometry
    } else if (points !== undefined) {
      this.geometry = call(defaultPathGeometry).fromPointArray({}, points)
    } else {
      this.geometry = call(defaultPathGeometry).fromPointArray({}, [])
    }
    if (closed === true) {
      this.geometry = call(this.geometry).close(this.geometry)
    }
  }

  concat(otherpath) {
    if (this.geometry.isClosed || otherpath.geometry.isClosed) {
      throw new Error('Paths must not be closed')
    }
    return new Path2D(undefined, undefined, call(this.geometry).concat(this.geometry, otherpath.geometry))
  }

  /**
   * Get the points that make up the path.
   * note that this is current internal list of points, not an immutable copy.
   * @returns {Vector2[]} array of points the make up the path
   */
  getPoints() {
    return call(this.geometry).toPointArray({}, this.geometry).map(point => [point[0], point[1]])
  }

  /**
   * Append an point to the end of the path.
   * @param {Vector2D} point - point to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoint(point) {
    if (this.geometry.isClosed) {
      throw new Error('Path must not be closed')
    }
    return new Path2D(undefined, undefined, call(this.geometry).appendPoint({}, point, this.geometry))
  }

  /**
   * Append a list of points to the end of the path.
   * @param {Vector2D[]} points - points to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoints(points) {
    if (this.geometry.isClosed) {
      throw new Error('Path must not be closed')
    }
    return new Path2D(undefined, undefined, call(this.geometry).concat(this.geometry, call(this.geometry).fromPointArray({}, points)))
  }

  close() {
    return new Path2D(undefined, undefined, call(this.geometry).close(this.geometry))
  }

  /**
   * Determine if the path is a closed or not.
   * @returns {Boolean} true when the path is closed, otherwise false
   */
  isClosed() {
    return this.geometry.isClosed
  }

  /**
   * Determine the overall clockwise or anti-clockwise turn of a path.
   * See: http://mathworld.wolfram.com/PolygonArea.html
   * @returns {String} One of ['clockwise', 'counter-clockwise', 'straight'].
   */
  getTurn() {
    const points = call(this.geometry).toPointArray({}, this.geometry)
    let twice_area = 0;
    let last = points.length - 1;
    for (let current = 0; current < points.length; last = current++) {
      twice_area += points[last][X] * points[current][Y] - points[last][Y] * points[current][X];
    }
    if (twice_area > 0) {
      return 'clockwise';
    } else if (twice_area < 0) {
      return 'counter-clockwise';
    } else {
      return 'straight';
    }
  }

  // Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
  // Returns a CSG solid
  //   width: width of the extrusion, in the z=0 plane
  //   height: height of the extrusion in the z direction
  //   resolution: number of segments per 360 degrees for the curve in a corner
  rectangularExtrude(width, height, resolution) {
    return Error('Not yet implemented')
  }

  // Expand the path to a CAG
  // This traces the path with a circle with radius pathradius
  expandToCAG(pathradius, resolution) {
    return Error('Not yet implemented')
  }

  innerToCAG() {
    return Error('Not yet implemented')
    // const CAG = require('../CAG') // FIXME: cyclic dependencies CAG => PATH2 => CAG
    // if (!this.closed) throw new Error('The path should be closed!')
    // return CAG.fromPoints(this.points)
  }

  transform(matrix4x4) {
    return new Path2D(undefined, undefined, call(this.geometry).transform(matrix4x4, this.geometry))
  }

  /**
   * Append a Bezier curve to the end of the path, using the control points to transition the curve through start and end points.
   * <br>
   * The Bézier curve starts at the last point in the path,
   * and ends at the last given control point. Other control points are intermediate control points.
   * <br>
   * The first control point may be null to ensure a smooth transition occurs. In this case,
   * the second to last control point of the path is mirrored into the control points of the Bezier curve.
   * In other words, the trailing gradient of the path matches the new gradient of the curve.
   * @param {Vector2D[]} controlpoints - list of control points
   * @param {Object} [options] - options for construction
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p5 = new CSG.Path2D([[10,-20]],false);
   * p5 = p5.appendBezier([[10,-10],[25,-10],[25,-20]]);
   * p5 = p5.appendBezier([[25,-30],[40,-30],[40,-20]]);
   */
  appendBezier(controlpoints, options) {
    return Error('Not yet implemented')
  }

  /**
   * Append an arc to the end of the path.
   * This implementation follows the SVG arc specs. For the details see
   * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
   * @param {Vector2D} endpoint - end point of arc
   * @param {Object} [options] - options for construction
   * @param {Number} [options.radius=0] - radius of arc (X and Y), see also xradius and yradius
   * @param {Number} [options.xradius=0] - X radius of arc, see also radius
   * @param {Number} [options.yradius=0] - Y radius of arc, see also radius
   * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
   * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
   * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
   * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
   * @returns {Path2D} new Path2D object (not closed)
   *
   * @example
   * let p1 = new CSG.Path2D([[27.5,-22.96875]],false);
   * p1 = p1.appendPoint([27.5,-3.28125]);
   * p1 = p1.appendArc([12.5,-22.96875], { xradius: 15, yradius: -19.6875, xaxisrotation: 0, clockwise: false, large: false });
   * p1 = p1.close();
   */
  appendArc(endpoint, options) {
    return new Path2D(undefined, undefined, call(this.geometry).fromPointArray({}, arc.toPointsSvg(options, endpoint)))
  }
}

/** Construct a path which is an arc of a circle.
 * @param {Object} [options] - options for construction
 * @param {vec3} [options.center=[0,0]] - center of circle
 * @param {Number} [options.radius=1] - radius of circle
 * @param {Number} [options.startangle=0] - starting angle of the arc, in degrees
 * @param {Number} [options.endangle=360] - ending angle of the arc, in degrees
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @param {Boolean} [options.maketangent=false] - adds line segments at both ends of the arc to ensure that the gradients at the edges are tangent
 * @returns {Path2D} new Path2D object (not closed)
 *
 * @example
 * let path = CSG.Path2D.arc({
 *   center: [5, 5],
 *   radius: 10,
 *   startangle: 90,
 *   endangle: 180,
 *   resolution: 36,
 *   maketangent: true
 * });
 */
Path2D.arc = (...params) => new Path2D(buildCircleArc(...params))

module.exports = Path2D
