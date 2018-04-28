const {areaEPS} = require('../constants')
const {linesIntersect} = require('../math/lineUtils')

// check if we are a valid CAG (for debugging)
// NOTE(bebbi) uneven side count doesn't work because rounding with EPS isn't taken into account
const isCAGValid = function (CAG) {
  let errors = []
  if (CAG.isSelfIntersecting(true)) {
    errors.push('Self intersects')
  }
  let pointcount = {}
  CAG.sides.map(function (side) {
    function mappoint (p) {
      let tag = p.x + ' ' + p.y
      if (!(tag in pointcount)) pointcount[tag] = 0
      pointcount[tag] ++
    }
    mappoint(side.vertex0.pos)
    mappoint(side.vertex1.pos)
  })
  for (let tag in pointcount) {
    let count = pointcount[tag]
    if (count & 1) {
      errors.push('Uneven number of sides (' + count + ') for point ' + tag)
    }
  }
  let area = CAG.area()
  if (area < areaEPS) {
    errors.push('Area is ' + area)
  }
  if (errors.length > 0) {
    let ertxt = ''
    errors.map(function (err) {
      ertxt += err + '\n'
    })
    throw new Error(ertxt)
  }
}

const isSelfIntersecting = function (cag, debug) {
  let numsides = cag.sides.length
  for (let i = 0; i < numsides; i++) {
    let side0 = cag.sides[i]
    for (let ii = i + 1; ii < numsides; ii++) {
      let side1 = cag.sides[ii]
      if (linesIntersect(side0.vertex0.pos, side0.vertex1.pos, side1.vertex0.pos, side1.vertex1.pos)) {
        if (debug) { console.log('side ' + i + ': ' + side0); console.log('side ' + ii + ': ' + side1) }
        return true
      }
    }
  }
  return false
}

/** Check if the point stay inside the CAG shape
* ray-casting algorithm based on :
* https://github.com/substack/point-in-polygon/blob/master/index.js
* http://www.ecse.rp1.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
* originaly writed for https://github.com/lautr3k/SLAcer.js/blob/dev/js/slacer/slicer.js#L82
* @param {CAG} cag - CAG object
* @param {Object} p0 - Vertex2 like object
* @returns {Boolean}
*/
const hasPointInside = function (cag, p0) {
  let p1 = null
  let p2 = null
  let inside = false
  cag.sides.forEach(side => {
    p1 = side.vertex0.pos
    p2 = side.vertex1.pos
    if (hasPointInside.c1(p0, p1, p2) && hasPointInside.c2(p0, p1, p2)) {
      inside = !inside
    }
  })
  return inside
}

hasPointInside.c1 = (p0, p1, p2) => (p1.y > p0.y) !== (p2.y > p0.y)
hasPointInside.c2 = (p0, p1, p2) => (p0.x < (p2.x - p1.x) * (p0.y - p1.y) / (p2.y - p1.y) + p1.x)

/** Check if all points from one CAG stay inside another CAG
* @param {CAG} cag1 - CAG object
* @param {Object} cag2 - CAG object
* @returns {Boolean}
*/
const contains = function (cag1, cag2) {
  for (let i = 0, il = cag2.sides.length; i < il; i++) {
    if (!hasPointInside(cag1, cag2.sides[i].vertex0.pos)) {
      return false
    }
  }
  return true
}

module.exports = {
  isCAGValid,
  isSelfIntersecting,
  hasPointInside,
  contains
}
