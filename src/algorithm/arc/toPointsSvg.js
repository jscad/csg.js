const quantizeForSpace = require('../../math/utils/quantizeForSpace')
const vec2 = require('../../math/vec2')

/**
 * Construct a line segment approximation of an arc, represented as an array of points.
 * This implementation follows the SVG arc specs. For the details see
 * http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
 * @param {Object} [options] - options for construction
 * @param {Number} [options.xRadius=0] - X radius of arc.
 * @param {Number} [options.yRadius=0] - Y radius of arc.
 * @param {Number} [options.xaxisrotation=0] -  rotation (in degrees) of the X axis of the arc with respect to the X axis of the coordinate system
 * @param {Number} [options.resolution=defaultResolution2D] - number of sides per 360 rotation
 * @param {Boolean} [options.clockwise=false] - draw an arc clockwise with respect to the center point
 * @param {Boolean} [options.large=false] - draw an arc longer than 180 degrees
 * @param {vec2} startPoint - start of arc
 * @param {vec2} endPoint - end of arc
 * @returns {Array[vec2]} a point array.
 *
 * @example
 * arc.toPointsSvg({ xRadius: 15, yRadius: -19.6875, xAxisRotation: 0, clockwise: false, large: false }, [0, 0], [12.5, -22.96875])
 */
const toPoints = ({ resolution = 32, xRadius = 0, yRadius = 0, xAxisRotation = 0, clockwise = false, large = false }, startPoint, endPoint) => {
  // Quantize inputs.
  startPoint = vec2.canonicalize(startPoint)
  endPoint = vec2.canonicalize(endPoint)
  xRadius = quantizeForSpace(xRadius)
  yRadius = quantizeForSpace(yRadius)

  const sweepFlag = !clockwise
  const points = [startPoint]

  if ((xRadius === 0) || (yRadius === 0)) {
    // http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes:
    // If rx = 0 or ry = 0, then treat this as a straight line from (x1, y1) to (x2, y2) and stop
    points.push(endPoint)
    return points
  }

  xRadius = Math.abs(xRadius)
  yRadius = Math.abs(yRadius)

  // see http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes :
  let phi = xAxisRotation * Math.PI / 180.0
  let cosPhi = Math.cos(phi)
  let sinPhi = Math.sin(phi)
  let minusHalfDistance = vec2.multiply(vec2.subtract(startPoint, endPoint),
                                        vec2.fromScalar(0.5))
  // F.6.5.1:
  // round to precision in order to have determinate calculations
  let x = quantizeForSpace((cosPhi * minusHalfDistance[0] + sinPhi * minusHalfDistance[1]))
  let y = quantizeForSpace((-sinPhi * minusHalfDistance[0] + cosPhi * minusHalfDistance[1]))
  let startTranslated = vec2.fromValues(x, y)
  // F.6.6.2:
  let bigLambda = (startTranslated[0] * startTranslated[0]) / (xRadius * xRadius) + (startTranslated[1] * startTranslated[1]) / (yRadius * yRadius)
  if (bigLambda > 1.0) {
    // F.6.6.3:
    let sqrtBigLambda = Math.sqrt(bigLambda)
    xRadius *= sqrtBigLambda
    yRadius *= sqrtBigLambda
    xRadius = quantizeForSpace(xRadius)
    yRadius = quantizeForSpace(yRadius)
  }
  // F.6.5.2:
  let multiplier1 = Math.sqrt((xRadius * xRadius * yRadius * yRadius - xRadius * xRadius * startTranslated[1] * startTranslated[1] - yRadius * yRadius * startTranslated[0] * startTranslated[0]) /
                              (xRadius * xRadius * startTranslated[1] * startTranslated[1] + yRadius * yRadius * startTranslated[0] * startTranslated[0]))
  if (sweepFlag === large) {
    // Either we're drawing a counter-clockwise arc that's larger than 180 degrees,
    // or we're drawing a clockwise arc that's not larger than 180 degrees.
    multiplier1 = -multiplier1
  }
  let centerTranslated = vec2.multiply(vec2.fromValues(xRadius * startTranslated[1] / yRadius,
                                                       -yRadius * startTranslated[0] / xRadius),
                                       vec2.fromScalar(multiplier1))
  // F.6.5.3:
  let center = vec2.add(vec2.fromValues(cosPhi * centerTranslated[0] - sinPhi * centerTranslated[1],
                                        sinPhi * centerTranslated[0] + cosPhi * centerTranslated[1]),
                        vec2.multiply(vec2.add(startPoint, endPoint),
                                      vec2.fromScalar(0.5)))
  // F.6.5.5:
  let v1 = vec2.fromValues((startTranslated[0] - centerTranslated[0]) / xRadius,
                           (startTranslated[1] - centerTranslated[1]) / yRadius)
  let v2 = vec2.fromValues((-startTranslated[0] - centerTranslated[0]) / xRadius,
                           (-startTranslated[1] - centerTranslated[1]) / yRadius)
  let theta1 = vec2.angleRadians(v1)
  let theta2 = vec2.angleRadians(v2)
  let deltaTheta = theta2 - theta1
  deltaTheta = deltaTheta % (2 * Math.PI)
  if ((!sweepFlag) && (deltaTheta > 0)) {
    deltaTheta -= 2 * Math.PI
  } else if ((sweepFlag) && (deltaTheta < 0)) {
    deltaTheta += 2 * Math.PI
  }

  // Ok, we have the center point and angle range (from theta1, deltaTheta radians) so we can create
  // the ellipse
  let numSteps = Math.ceil(Math.abs(deltaTheta) / (2 * Math.PI) * resolution) + 1
  if (numSteps < 1) {
    numSteps = 1
  }
  for (let step = 1; step <= numSteps; step++) {
    let theta = theta1 + step / numSteps * deltaTheta
    let costheta = Math.cos(theta)
    let sintheta = Math.sin(theta)
    // F.6.3.1:
    let point = vec2.add(center,
                         vec2.fromValues(cosPhi * xRadius * costheta - sinPhi * yRadius * sintheta,
                                         sinPhi * xRadius * costheta + cosPhi * yRadius * sintheta))
    points.push(vec2.canonicalize(point))
  }
  return points
}

module.exports = toPoints
