const {vec2} = require('../../math')

const toSides = require('./toSides')

// create a list of edges (sides) which share vertices
// which allows traversal of the edges
const toEdges = (sides) => {
  let uniquevertices = []
  const getUniqueVertex = (vertex) => {
    let i = uniquevertices.findIndex((v) => {
      return vec2.equals(v, vertex)
    })
    if (i < 0) {
      uniquevertices.push(vertex)
      return vertex
    }
    return uniquevertices[i]
  }

  let edges = []
  sides.forEach((side) => {
    edges.push([getUniqueVertex(side[0]), getUniqueVertex(side[1])])
  })
  return edges
}

/** returns the outline(s) of the given 2D geometry as an array of points
 * @param  {geom2} geometry
 * @returns {Array} array of point sets, where each set is an array of points
 */
const toOutlines = (geometry) => {
  let vertexMap = new Map()
  let edges = toEdges(toSides(geometry))
  edges.forEach((edge) => {
    if (!(vertexMap.has(edge[0]))) {
      vertexMap.set(edge[0], [])
    }
    let sideslist = vertexMap.get(edge[0])
    sideslist.push(edge)
    sideslist = vertexMap.get(edge[0])
  })

  let outlines = []
  while (true) {
    let startside = undefined
    for (let [vertex, edges] of vertexMap) {
      startside = edges.shift()
      if (!startside) {
        vertexMap.delete(vertex)
        continue
      }
      break
    }
    if (startside === undefined) break // all starting sides have been visited

    let connectedVertexPoints = []
    let startvertex = startside[0]
    while (true) {
      connectedVertexPoints.push(startside[0])
      let nextvertex = startside[1]
      if (nextvertex === startvertex) break // the outline has been closed
      let nextpossiblesides = vertexMap.get(nextvertex)
      if (!nextpossiblesides) {
        throw new Error('the given geometry is not closed. verify proper construction')
      }
      let nextsideindex = -1
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
    outlines.push(connectedVertexPoints)
  } // outer loop
  vertexMap.clear()
  return outlines
}

module.exports = toOutlines
