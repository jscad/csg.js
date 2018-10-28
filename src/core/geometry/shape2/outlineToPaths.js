const canonicalize = require('./canonicalize')

//const path2 = require('../path2')
const vec2 = require('../../math/vec2')

/** returns the outline of the given Shape2 as an array of paths
 * @param  {shape2} shape
 * @returns {Array} array of paths
 */
const outlineToPaths = (shape) => {
console.log('--- outlineToPaths ---')
  let cleanShape = canonicalize(shape)
  let vertexMap = new Map()
  cleanShape.sides.map(function (side) {
    if (!(vertexMap.has(side[0]))) {
console.log('  set: ' + side[0])
      vertexMap.set(side[0], [])
    }
    let sideslist = vertexMap.get(side[0])
console.log('  push: ' + side)
    console.log(sideslist.push(side))
    sideslist = vertexMap.get(side[0])
  })
  let paths = []
  while (true) {
    let startside = undefined
console.log('  startside: ' + startside)
    for (let [vertex, sides] of vertexMap) {
      startside = sides.shift()
      if (!startside) {
console.log('  delete: ' + vertex)
        vertexMap.delete(vertex)
        continue
      }
      break
    }
    if (startside === undefined) break // all vertices have been visited
console.log('  startside: ' + startside)
    let connectedVertexPoints = []
    let startvertex = startside[0]
console.log('  startvertex: ' + startvertex)
    while (true) {
      connectedVertexPoints.push(startside[0])
      let nextvertex = startside[1]
console.log('  nextvertex: ' + nextvertex)
      if (nextvertex === startvertex) break // we've closed the polygon
      let nextpossiblesides = vertexMap.get(nextvertex)
console.log('  nextpossiblesides: ' + nextpossiblesides)
      if (!nextpossiblesides) {
        throw new Error('Area is not closed!')
      }
      let nextsideindex = -1
console.log('  nextpossiblesides.length: ' + nextpossiblesides.length)
      if (nextpossiblesides.length === 1) {
        nextsideindex = 0
      } else {
        // more than one side starting at the same vertex
        let bestangle = null
        let cagangle = vec2.angleDegrees(direction(startside))
        for (let sideindex = 0; sideindex < nextpossiblesides.length; sideindex++) {
          let nextpossibleside = nextpossiblesides[sideindex]
          let possibleside = nextpossiblesidetag
          let angle = vec2.angleDegrees(direction(possibleside))
          let angledif = angle - cagangle
          if (angledif < -180) angledif += 360
          if (angledif >= 180) angledif -= 360
          if ((nextsideindex < 0) || (angledif > bestangle)) {
            nextsideindex = sideindex
            bestangle = angledif
          }
        }
      }
      let nextside = nextpossiblesides[nextsideindex]
      nextpossiblesides.splice(nextsideindex, 1) // remove side from list
      if (nextpossiblesides.length === 0) {
        vertexMap.delete(nextvertex)
      }
      startside = nextside
    } // inner loop
    // due to the logic of fromPoints()
    // move the first point to the last
    if (connectedVertexPoints.length > 0) {
      connectedVertexPoints.push(connectedVertexPoints.shift())
    }
console.log('  path:')
console.log(connectedVertexPoints)
    //let path = new Path2D(connectedVertexPoints, true)
    //paths.push(path)
  } // outer loop
  vertexMap.clear()
  return paths
}

module.exports = outlineToPaths
