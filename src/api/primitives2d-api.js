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

/** Construct a polygon either from arrays of paths and points, or just arrays of points
 * nested paths (multiple paths) and flat paths are supported
 * @param {Object} [options] - options for construction
 * @param {Array} [options.paths] - paths of the polygon : either flat or nested array
 * @param {Array} [options.points] - points of the polygon : either flat or nested array
 * @returns {CAG} new polygon
 *
 * @example
 * let poly = polygon([0,1,2,3,4])
 * or
 * let poly = polygon([[0,1,2,3],[4,5,6,7]])
 * or
 * let poly = polygon({path: [0,1,2,3,4]})
 * or
 * let poly = polygon({path: [0,1,2,3,4], points: [2,1,3]})
 */
function polygon (params) { // array of po(ints) and pa(ths)
  let points = [ ]
  if (params.paths && params.paths.length && params.paths[0].length) { // pa(th): [[0,1,2],[2,3,1]] (two paths)
    for (let j = 0; j < params.paths.length; j++) {
      for (let i = 0; i < params.paths[j].length; i++) {
        points[i] = params.points[params.paths[j][i]]
      }
    }
  } else if (params.paths && params.paths.length) { // pa(th): [0,1,2,3,4] (single path)
    for (let i = 0; i < params.paths.length; i++) {
      points[i] = params.points[params.paths[i]]
    }
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

function radians (degrees) {
  return degrees * Math.PI / 180;
}

function sinlaw (s, A1, A2) {
  return (s / Math.sin(radians(A1))) * Math.sin(radians(A2))
}

/** Construct a triangle
 *
 *          (B)
 *          / \
 *         /   \
 *    (a) /     \ (c)
 *       /       \
 *      /         \
 *  (C) _ _ _ _ _ _ (A)
 *          (b)
 *
 * Theory: https://www.mathsisfun.com/algebra/trig-solving-triangles.html
 *
 * @returns {CAG} new triangle
 *
 * @example
 * // Defaults: Equilateral triangle with sides of 1
 * let t1 = triangle()
 * 
 * // AAS Triangles
 * let t2 = triangle({ angles: { A: 90, B: 45 }, lengths: { a: 14.142135623730951 } })
 * let t3 = triangle({ angles: { A: 90, B: 45 }, lengths: { b: 10 } })
 * let t4 = triangle({ angles: { A: 90, C: 45 }, lengths: { c: 10 } })
 */
function triangle (params) {
  let [ A, B, C, a, b, c ] = arguments.length ? [] : [60, 60, 60, null, 10, null]

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
    if (Array.isArray(params.angles)) { // triangle({ angles: [ A, B, C ]})
      ([ A, B, C ] = params.angles)
    } else if (typeof params.angles === 'object') { // triangle({ angles: { A, B, C }})
      ({ A, B, C } = params.angles)
    }
    if (Array.isArray(params.lengths)) { // triangle({ lengths: [ a, b, c ]})
      ([ a, b, c ] = params.lengths)
    } else if (typeof params.lengths === 'object') { // triangle({ lengths: { a, b, c }})
      ({ a, b, c } = params.lengths)
    }
  }

  A = parseFloat(A || 0)
  B = parseFloat(B || 0)
  C = parseFloat(C || 0)
  a = parseFloat(a || 0)
  b = parseFloat(b || 0)
  c = parseFloat(c || 0)

  // Shortcuts...
  let AB = A && B
  let BC = B && C
  let CA = C && A
  let ab = a && b
  let bc = b && c
  let ca = c && a

  // Solving AAS Triangles
  if ((AB || BC || CA) && (a || b || c)) {
    let angle = 180 - A - B - C

    !A && (A = angle)
    !B && (B = angle)
    !C && (C = angle)

    if (a) {
      c = sinlaw(a, A, C)
      b = sinlaw(c, C, B)
    } else if (b) {
      a = sinlaw(b, B, A)
      c = sinlaw(a, A, C)
    } else if (c) {
      b = sinlaw(c, C, B)
      a = sinlaw(b, B, A)
    }
  }

  // Compute triangle points
  let p1 = [ -b / 2, 0 ]
  let p2 = [ b / 2, 0 ]
  let [x, y] = circlesIntersection(p1[0], p1[1], a, p2[0], p2[1], c)
  let points = [ p1, p2, [x, y] ]

  console.log('angles:', { A, B, C })
  console.log('lengths:', { a, b, c })
  console.log('points:', points)

  return fromPoints(points)
}

module.exports = {
  circle,
  square,
  polygon,
  triangle
}
