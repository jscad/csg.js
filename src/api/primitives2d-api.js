const {CAG} = require('../../csg')// we have to import from top level otherwise prototypes are not complete..
const {fromPoints} = require('../core/CAGFactories')
const {circlesIntersection} = require('../core/math/lineUtils')

/** Construct a square/rectangle
 * @param {Object} [options] - options for construction
 * @param {Float} [options.size=1] - size of the square, either as array or scalar
 * @param {Boolean} [options.center=true] - wether to center the square/rectangle or not
 * @returns {CAG} new square
 *
 * @example
 * let square1 = square({
 *   size: 10
 * })
 */
function square () {
  let v = [1, 1]
  let off
  let a = arguments
  let params = a[0]

  if (params && Number.isFinite(params)) v = [params, params]
  if (params && params.length) {
    v = a[0]
    params = a[1]
  }
  if (params && params.size && params.size.length) v = params.size

  off = [v[0] / 2, v[1] / 2]
  if (params && params.center === true) off = [0, 0]

  return CAG.rectangle({center: off, radius: [v[0] / 2, v[1] / 2]})
}

/** Construct a circle
 * @param {Object} [options] - options for construction
 * @param {Float} [options.r=1] - radius of the circle
 * @param {Integer} [options.fn=32] - segments of circle (ie quality/ resolution)
 * @param {Boolean} [options.center=true] - wether to center the circle or not
 * @returns {CAG} new circle
 *
 * @example
 * let circle1 = circle({
 *   r: 10
 * })
 */
function circle (params) {
  const defaults = {
    r: 1,
    fn: 32,
    center: false
  }
  let {r, fn, center} = Object.assign({}, defaults, params)
  if (params && !params.r && !params.fn && !params.center) r = params
  let offset = center === true ? [0, 0] : [r, r]
  return CAG.circle({center: offset, radius: r, resolution: fn})
}

/** Construct a polygon either from arrays of paths and points,
 * or just arrays of points nested paths (multiple paths) and flat paths are supported
 * @param {Object} [options] - options for construction or either flat or nested array of points
 * @param {Array} [options.points] - points of the polygon : either flat or nested array of points
 * @param {Array} [options.paths] - paths of the polygon : either flat or nested array of points index
 * @returns {CAG} new polygon
 *
 * @example
 * let roof = [[10,11], [0,11], [5,20]]
 * let wall = [[0,0], [10,0], [10,10], [0,10]]
 *
 * let poly = polygon(roof)
 * or
 * let poly = polygon([roof, wall])
 * or
 * let poly = polygon({ points: roof })
 * or
 * let poly = polygon({ points: [roof, wall] })
 * or
 * let poly = polygon({ points: roof, path: [0, 1, 2] })
 * or
 * let poly = polygon({ points: [roof, wall], path: [[0, 1, 2], [3, 4, 5, 6]] })
 * or
 * let poly = polygon({ points: roof.concat(wall), paths: [[0, 1, 2], [3, 4, 5], [3, 6, 5]] })
 */
function polygon (params) { // array of po(ints) and pa(ths)
  let points = []
  if (params.paths && params.paths.length && params.paths[0].length) { // pa(th): [[0,1,2],[2,3,1]] (two paths)
    if (typeof params.points[0][0] !== 'number') { // flatten points array
      params.points = params.points.reduce((a, b) => a.concat(b))
    }
    params.paths.forEach((path, i) => {
      points.push([])
      path.forEach(j => points[i].push(params.points[j]))
    })
  } else if (params.paths && params.paths.length) { // pa(th): [0,1,2,3,4] (single path)
    params.paths.forEach(i => points.push(params.points[i]))
  } else { // pa(th) = po(ints)
    if (params.length) {
      points = params
    } else {
      points = params.points
    }
  }
  return fromPoints(points)
}

// FIXME: errr this is kinda just a special case of a polygon , why do we need it ?
// FIXED: I do not know at all, but if he is still there, he must work ;)

/** Construct a triangle
 *
 *          (B)
 *          / \
 *         /   \
 *    (c) /     \ (a)
 *       /       \
 *      /         \
 *  (A) _ _ _ _ _ _ (C)
 *          (b)
 *
 * Theory: https://www.mathsisfun.com/algebra/trig-solving-triangles.html
 * Inspiration: https://www.nayuki.io/res/triangle-solver-javascript/triangle-solver.js
 *
 * @returns {CAG} new triangle
 */
function triangle (params) {
  // By default output an equilateral triangle with sides of 1
  let [ A, B, C, a, b, c ] = arguments.length ? [] : [ 60, 60, 60, null, 10, null ]

  // By default return the bigger triangle in case of multiple solutions
  let returnBiggest = true

  // Handle all variantes of arguments
  if (arguments.length > 1) {
    if (Array.isArray(arguments[0])) { // triangle([a, b, c], [A, B, C])
      ([ A, B, C ] = arguments[0]) && ([ a, b, c ] = arguments[1] || [])
    } else { // triangle(a, b, c, A, B, C)
      ([ A, B, C, a, b, c ] = arguments)
    }
  } else if (Array.isArray(params)) {
    if (Array.isArray(params[0])) { // triangle([ [a, b, c], [A, B, C] ])
      ([ A, B, C ] = params[0]) && ([ a, b, c ] = params[1] || [])
    } else { // triangle([ a, b, c, A, B, C ])
      ([ A, B, C, a, b, c ] = params)
    }
  } else {
    params = params || {}
    if (Array.isArray(params.angles)) { // triangle({ angles: [ A, B, C ] })
      ([ A, B, C ] = params.angles)
    } else if (typeof params.angles === 'object') { // triangle({ angles: { A, B, C } })
      ({ A, B, C } = params.angles)
    }
    if (Array.isArray(params.lengths)) { // triangle({ lengths: [ a, b, c ] })
      ([ a, b, c ] = params.lengths)
    } else if (typeof params.lengths === 'object') { // triangle({ lengths: { a, b, c } })
      ({ a, b, c } = params.lengths)
    }
    returnBiggest = params.returnBiggest !== undefined ? !!params.returnBiggest : true
  }

  // Sanitize inputs
  A = parseFloat(A || 0)
  B = parseFloat(B || 0)
  C = parseFloat(C || 0)
  a = parseFloat(a || 0)
  b = parseFloat(b || 0)
  c = parseFloat(c || 0)

  // Validate inputs
  let angles = (!!A) + (!!B) + (!!C)
  let lengths = (!!a) + (!!b) + (!!c)
  let inputs = angles + lengths

  if (inputs < 3) {
    throw new Error('At least three values are needed to solve a triangle')
  }

  if (lengths < 1) {
    throw new Error('At least one side length is needed to solve a triangle')
  }

  // SSS triangle
  if (lengths === 3) {
    if (((a + b) <= c) || ((b + c) <= a) || ((c + a) <= b)) {
      throw new Error('The longest side is longer than the sum of the other sides')
    }
    return triangleFromLengths(a, b, c)
  }

  // ASA triangle
  if (angles === 2) {
    // Find missing angle
    !A && (A = 180 - B - C)
    !B && (B = 180 - C - A)
    !C && (C = 180 - A - B)

    if ((A <= 0) || (B <= 0) || (C <= 0)) {
      throw new Error('All angles must be greater than 0°')
    }

    // Use law of sines to find sides
    let ratio  // side / sin(angle)
    let sinA = Math.sin(radians(A))
    let sinB = Math.sin(radians(B))
    let sinC = Math.sin(radians(C))

    a && (ratio = a / sinA)
    b && (ratio = b / sinB)
    c && (ratio = c / sinC)
    !a && (a = ratio * sinA)
    !b && (b = ratio * sinB)
    !c && (c = ratio * sinC)

    return triangleFromLengths(a, b, c)
  }

  // SAS triangle
  if ((A && !a) || (B && !b) || (C && !c)) {
    if ((A >= 180) || (B >= 180) || (C >= 180)) {
      throw new Error('All angles must be smaller than 180°')
    }

    !a && (a = triangleSolveSide(b, c, A))
    !b && (b = triangleSolveSide(c, a, B))
    !c && (c = triangleSolveSide(a, b, C))

    return triangleFromLengths(a, b, c)
  }

  // SSA triangle
  let [ knownSide, knownAngle, partialSide ] = []

  if (a && A) {
    knownSide = a
    knownAngle = A
  }

  if (b && B) {
    knownSide = b
    knownAngle = B
  }

  if (c && C) {
    knownSide = c
    knownAngle = C
  }

  if (a && !A) { partialSide = a }
  if (b && !B) { partialSide = b }
  if (c && !C) { partialSide = c }

  if (knownAngle >= 180) {
    throw new Error('All angles must be smaller than 180°')
  }

  let [ partialAngle, unknownSide, unknownAngle ] = []
  let ratio = knownSide / Math.sin(radians(knownAngle))
  let temp = partialSide / ratio // sin(partialAngle)

  if ((temp > 1) || (knownAngle >= 90) && (knownSide <= partialSide)) {
    throw new Error('A triangle can\'t have two angles greater than 90°')
  }

  if ((temp == 1) || (knownSide >= partialSide)) {
    partialAngle = degrees(Math.asin(temp))
    unknownAngle = 180 - knownAngle - partialAngle
    unknownSide = ratio * Math.sin(radians(unknownAngle)) // Law of sines
  } else {
    let partialAngle0 = degrees(Math.asin(temp))
    let partialAngle1 = 180 - partialAngle0
    let unknownAngle0 = 180 - knownAngle - partialAngle0
    let unknownAngle1 = 180 - knownAngle - partialAngle1
    let unknownSide0 = ratio * Math.sin(radians(unknownAngle0))  // Law of sines
    let unknownSide1 = ratio * Math.sin(radians(unknownAngle1))  // Law of sines
    partialAngle = [ partialAngle0, partialAngle1 ]
    unknownAngle = [ unknownAngle0, unknownAngle1 ]
    unknownSide = [ unknownSide0, unknownSide1 ]
    let area0 = knownSide * partialSide * Math.sin(radians(unknownAngle0)) / 2
    let area1 = knownSide * partialSide * Math.sin(radians(unknownAngle1)) / 2
    if ((area0 > area1) && returnBiggest) {
      partialAngle = partialAngle0
      unknownSide = unknownSide0
    } else {
      partialAngle = partialAngle1
      unknownSide = unknownSide1
    }
  }

  if (a && !A) { A = partialAngle }
  if (b && !B) { B = partialAngle }
  if (c && !C) { C = partialAngle }
  if (!a && !A) { a = unknownSide }
  if (!b && !B) { b = unknownSide }
  if (!c && !C) { c = unknownSide }

  // Output the triangle
  return triangleFromLengths(a, b, c)
}

function radians (degrees) {
  return degrees / 180 * Math.PI
}

function degrees (radians) {
  return radians / Math.PI * 180
}

function triangleSolveSide(a, b, C) {
  C = radians(C)

  if (C > 0.001) {
    return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C))
  }

  // Explained in https://www.nayuki.io/page/numerically-stable-law-of-cosines
  return Math.sqrt((a - b) * (a - b) + a * b * C * C * (1 - C * C / 12))
}

function triangleFromLengths (a, b, c) {
  let p1 = [ -b / 2, 0 ]
  let p2 = [ b / 2, 0 ]
  let [x, y] = circlesIntersection(p1[0], p1[1], a, p2[0], p2[1], c)
  return fromPoints([ p1, p2, [x, y] ])
}

module.exports = {
  circle,
  square,
  polygon,
  triangle
}
