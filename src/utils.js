
function fnNumberSort (a, b) {
  return a - b
}

function fnSortByIndex (a, b) {
  return a.index - b.index
}

const IsFloat = function (n) {
  return (!isNaN(n)) || (n === Infinity) || (n === -Infinity)
}

const solve2Linear = function (a, b, c, d, u, v) {
  let det = a * d - b * c
  let invdet = 1.0 / det
  let x = u * d - b * v
  let y = -u * c + a * v
  x *= invdet
  y *= invdet
  return [x, y]
}

function insertSorted (array, element, comparefunc) {
  let leftbound = 0
  let rightbound = array.length
  while (rightbound > leftbound) {
    let testindex = Math.floor((leftbound + rightbound) / 2)
    let testelement = array[testindex]
    let compareresult = comparefunc(element, testelement)
    if (compareresult > 0) // element > testelement
    {
      leftbound = testindex + 1
    } else {
      rightbound = testindex
    }
  }
  array.splice(leftbound, 0, element)
}

// Get the x coordinate of a point with a certain y coordinate, interpolated between two
// points (CSG.Vector2D).
// Interpolation is robust even if the points have the same y coordinate
const interpolateBetween2DPointsForY = function (point1, point2, y) {
  let f1 = y - point1.y
  let f2 = point2.y - point1.y
  if (f2 < 0) {
    f1 = -f1
    f2 = -f2
  }
  let t
  if (f1 <= 0) {
    t = 0.0
  } else if (f1 >= f2) {
    t = 1.0
  } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
    t = 0.5
  } else {
    t = f1 / f2
  }
  let result = point1.x + t * (point2.x - point1.x)
  return result
}

// Retesselation function for a set of coplanar polygons. See the introduction at the top of
// this file.
const reTesselateCoplanarPolygons = function (sourcepolygons, destpolygons) {
  let numpolygons = sourcepolygons.length
  if (numpolygons > 0) {
    let plane = sourcepolygons[0].plane
    let shared = sourcepolygons[0].shared
    let orthobasis = new CSG.OrthoNormalBasis(plane)
    let polygonvertices2d = [] // array of array of CSG.Vector2D
    let polygontopvertexindexes = [] // array of indexes of topmost vertex per polygon
    let topy2polygonindexes = {}
    let ycoordinatetopolygonindexes = {}

    let xcoordinatebins = {}
    let ycoordinatebins = {}

        // convert all polygon vertices to 2D
        // Make a list of all encountered y coordinates
        // And build a map of all polygons that have a vertex at a certain y coordinate:
    let ycoordinateBinningFactor = 1.0 / CSG.EPS * 10
    for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
      let poly3d = sourcepolygons[polygonindex]
      let vertices2d = []
      let numvertices = poly3d.vertices.length
      let minindex = -1
      if (numvertices > 0) {
        let miny, maxy, maxindex
        for (let i = 0; i < numvertices; i++) {
          let pos2d = orthobasis.to2D(poly3d.vertices[i].pos)
                    // perform binning of y coordinates: If we have multiple vertices very
                    // close to each other, give them the same y coordinate:
          let ycoordinatebin = Math.floor(pos2d.y * ycoordinateBinningFactor)
          let newy
          if (ycoordinatebin in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin]
          } else if (ycoordinatebin + 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin + 1]
          } else if (ycoordinatebin - 1 in ycoordinatebins) {
            newy = ycoordinatebins[ycoordinatebin - 1]
          } else {
            newy = pos2d.y
            ycoordinatebins[ycoordinatebin] = pos2d.y
          }
          pos2d = CSG.Vector2D.Create(pos2d.x, newy)
          vertices2d.push(pos2d)
          let y = pos2d.y
          if ((i === 0) || (y < miny)) {
            miny = y
            minindex = i
          }
          if ((i === 0) || (y > maxy)) {
            maxy = y
            maxindex = i
          }
          if (!(y in ycoordinatetopolygonindexes)) {
            ycoordinatetopolygonindexes[y] = {}
          }
          ycoordinatetopolygonindexes[y][polygonindex] = true
        }
        if (miny >= maxy) {
                    // degenerate polygon, all vertices have same y coordinate. Just ignore it from now:
          vertices2d = []
          numvertices = 0
          minindex = -1
        } else {
          if (!(miny in topy2polygonindexes)) {
            topy2polygonindexes[miny] = []
          }
          topy2polygonindexes[miny].push(polygonindex)
        }
      } // if(numvertices > 0)
            // reverse the vertex order:
      vertices2d.reverse()
      minindex = numvertices - minindex - 1
      polygonvertices2d.push(vertices2d)
      polygontopvertexindexes.push(minindex)
    }
    let ycoordinates = []
    for (let ycoordinate in ycoordinatetopolygonindexes) ycoordinates.push(ycoordinate)
    ycoordinates.sort(fnNumberSort)

        // Now we will iterate over all y coordinates, from lowest to highest y coordinate
        // activepolygons: source polygons that are 'active', i.e. intersect with our y coordinate
        //   Is sorted so the polygons are in left to right order
        // Each element in activepolygons has these properties:
        //        polygonindex: the index of the source polygon (i.e. an index into the sourcepolygons
        //                      and polygonvertices2d arrays)
        //        leftvertexindex: the index of the vertex at the left side of the polygon (lowest x)
        //                         that is at or just above the current y coordinate
        //        rightvertexindex: dito at right hand side of polygon
        //        topleft, bottomleft: coordinates of the left side of the polygon crossing the current y coordinate
        //        topright, bottomright: coordinates of the right hand side of the polygon crossing the current y coordinate
    let activepolygons = []
    let prevoutpolygonrow = []
    for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
      let newoutpolygonrow = []
      let ycoordinate_as_string = ycoordinates[yindex]
      let ycoordinate = Number(ycoordinate_as_string)

            // update activepolygons for this y coordinate:
            // - Remove any polygons that end at this y coordinate
            // - update leftvertexindex and rightvertexindex (which point to the current vertex index
            //   at the the left and right side of the polygon
            // Iterate over all polygons that have a corner at this y coordinate:
      let polygonindexeswithcorner = ycoordinatetopolygonindexes[ycoordinate_as_string]
      for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
        let activepolygon = activepolygons[activepolygonindex]
        let polygonindex = activepolygon.polygonindex
        if (polygonindexeswithcorner[polygonindex]) {
                    // this active polygon has a corner at this y coordinate:
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length
          let newleftvertexindex = activepolygon.leftvertexindex
          let newrightvertexindex = activepolygon.rightvertexindex
                    // See if we need to increase leftvertexindex or decrease rightvertexindex:
          while (true) {
            let nextleftvertexindex = newleftvertexindex + 1
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
            if (vertices2d[nextleftvertexindex].y != ycoordinate) break
            newleftvertexindex = nextleftvertexindex
          }
          let nextrightvertexindex = newrightvertexindex - 1
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
          if (vertices2d[nextrightvertexindex].y == ycoordinate) {
            newrightvertexindex = nextrightvertexindex
          }
          if ((newleftvertexindex != activepolygon.leftvertexindex) && (newleftvertexindex == newrightvertexindex)) {
                        // We have increased leftvertexindex or decreased rightvertexindex, and now they point to the same vertex
                        // This means that this is the bottom point of the polygon. We'll remove it:
            activepolygons.splice(activepolygonindex, 1)
            --activepolygonindex
          } else {
            activepolygon.leftvertexindex = newleftvertexindex
            activepolygon.rightvertexindex = newrightvertexindex
            activepolygon.topleft = vertices2d[newleftvertexindex]
            activepolygon.topright = vertices2d[newrightvertexindex]
            let nextleftvertexindex = newleftvertexindex + 1
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
            activepolygon.bottomleft = vertices2d[nextleftvertexindex]
            let nextrightvertexindex = newrightvertexindex - 1
            if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
            activepolygon.bottomright = vertices2d[nextrightvertexindex]
          }
        } // if polygon has corner here
      } // for activepolygonindex
      let nextycoordinate
      if (yindex >= ycoordinates.length - 1) {
                // last row, all polygons must be finished here:
        activepolygons = []
        nextycoordinate = null
      } else // yindex < ycoordinates.length-1
            {
        nextycoordinate = Number(ycoordinates[yindex + 1])
        let middleycoordinate = 0.5 * (ycoordinate + nextycoordinate)
                // update activepolygons by adding any polygons that start here:
        let startingpolygonindexes = topy2polygonindexes[ycoordinate_as_string]
        for (let polygonindex_key in startingpolygonindexes) {
          let polygonindex = startingpolygonindexes[polygonindex_key]
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length
          let topvertexindex = polygontopvertexindexes[polygonindex]
                    // the top of the polygon may be a horizontal line. In that case topvertexindex can point to any point on this line.
                    // Find the left and right topmost vertices which have the current y coordinate:
          let topleftvertexindex = topvertexindex
          while (true) {
            let i = topleftvertexindex + 1
            if (i >= numvertices) i = 0
            if (vertices2d[i].y != ycoordinate) break
            if (i == topvertexindex) break // should not happen, but just to prevent endless loops
            topleftvertexindex = i
          }
          let toprightvertexindex = topvertexindex
          while (true) {
            let i = toprightvertexindex - 1
            if (i < 0) i = numvertices - 1
            if (vertices2d[i].y != ycoordinate) break
            if (i == topleftvertexindex) break // should not happen, but just to prevent endless loops
            toprightvertexindex = i
          }
          let nextleftvertexindex = topleftvertexindex + 1
          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0
          let nextrightvertexindex = toprightvertexindex - 1
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1
          let newactivepolygon = {
            polygonindex: polygonindex,
            leftvertexindex: topleftvertexindex,
            rightvertexindex: toprightvertexindex,
            topleft: vertices2d[topleftvertexindex],
            topright: vertices2d[toprightvertexindex],
            bottomleft: vertices2d[nextleftvertexindex],
            bottomright: vertices2d[nextrightvertexindex]
          }
          insertSorted(activepolygons, newactivepolygon, function (el1, el2) {
            let x1 = CSG.interpolateBetween2DPointsForY(
                            el1.topleft, el1.bottomleft, middleycoordinate)
            let x2 = CSG.interpolateBetween2DPointsForY(
                            el2.topleft, el2.bottomleft, middleycoordinate)
            if (x1 > x2) return 1
            if (x1 < x2) return -1
            return 0
          })
        } // for(let polygonindex in startingpolygonindexes)
      } //  yindex < ycoordinates.length-1
            // if( (yindex == ycoordinates.length-1) || (nextycoordinate - ycoordinate > EPS) )
      if (true) {
                // Now activepolygons is up to date
                // Build the output polygons for the next row in newoutpolygonrow:
        for (let activepolygon_key in activepolygons) {
          let activepolygon = activepolygons[activepolygon_key]
          let polygonindex = activepolygon.polygonindex
          let vertices2d = polygonvertices2d[polygonindex]
          let numvertices = vertices2d.length

          let x = CSG.interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate)
          let topleft = CSG.Vector2D.Create(x, ycoordinate)
          x = CSG.interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate)
          let topright = CSG.Vector2D.Create(x, ycoordinate)
          x = CSG.interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate)
          let bottomleft = CSG.Vector2D.Create(x, nextycoordinate)
          x = CSG.interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate)
          let bottomright = CSG.Vector2D.Create(x, nextycoordinate)
          let outpolygon = {
            topleft: topleft,
            topright: topright,
            bottomleft: bottomleft,
            bottomright: bottomright,
            leftline: CSG.Line2D.fromPoints(topleft, bottomleft),
            rightline: CSG.Line2D.fromPoints(bottomright, topright)
          }
          if (newoutpolygonrow.length > 0) {
            let prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1]
            let d1 = outpolygon.topleft.distanceTo(prevoutpolygon.topright)
            let d2 = outpolygon.bottomleft.distanceTo(prevoutpolygon.bottomright)
            if ((d1 < CSG.EPS) && (d2 < CSG.EPS)) {
                            // we can join this polygon with the one to the left:
              outpolygon.topleft = prevoutpolygon.topleft
              outpolygon.leftline = prevoutpolygon.leftline
              outpolygon.bottomleft = prevoutpolygon.bottomleft
              newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1)
            }
          }
          newoutpolygonrow.push(outpolygon)
        } // for(activepolygon in activepolygons)
        if (yindex > 0) {
                    // try to match the new polygons against the previous row:
          let prevcontinuedindexes = {}
          let matchedindexes = {}
          for (let i = 0; i < newoutpolygonrow.length; i++) {
            let thispolygon = newoutpolygonrow[i]
            for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
              if (!matchedindexes[ii]) // not already processed?
                            {
                                // We have a match if the sidelines are equal or if the top coordinates
                                // are on the sidelines of the previous polygon
                let prevpolygon = prevoutpolygonrow[ii]
                if (prevpolygon.bottomleft.distanceTo(thispolygon.topleft) < CSG.EPS) {
                  if (prevpolygon.bottomright.distanceTo(thispolygon.topright) < CSG.EPS) {
                                        // Yes, the top of this polygon matches the bottom of the previous:
                    matchedindexes[ii] = true
                                        // Now check if the joined polygon would remain convex:
                    let d1 = thispolygon.leftline.direction().x - prevpolygon.leftline.direction().x
                    let d2 = thispolygon.rightline.direction().x - prevpolygon.rightline.direction().x
                    let leftlinecontinues = Math.abs(d1) < CSG.EPS
                    let rightlinecontinues = Math.abs(d2) < CSG.EPS
                    let leftlineisconvex = leftlinecontinues || (d1 >= 0)
                    let rightlineisconvex = rightlinecontinues || (d2 >= 0)
                    if (leftlineisconvex && rightlineisconvex) {
                                            // yes, both sides have convex corners:
                                            // This polygon will continue the previous polygon
                      thispolygon.outpolygon = prevpolygon.outpolygon
                      thispolygon.leftlinecontinues = leftlinecontinues
                      thispolygon.rightlinecontinues = rightlinecontinues
                      prevcontinuedindexes[ii] = true
                    }
                    break
                  }
                }
              } // if(!prevcontinuedindexes[ii])
            } // for ii
          } // for i
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!prevcontinuedindexes[ii]) {
                            // polygon ends here
                            // Finish the polygon with the last point(s):
              let prevpolygon = prevoutpolygonrow[ii]
              prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright)
              if (prevpolygon.bottomright.distanceTo(prevpolygon.bottomleft) > CSG.EPS) {
                                // polygon ends with a horizontal line:
                prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft)
              }
                            // reverse the left half so we get a counterclockwise circle:
              prevpolygon.outpolygon.leftpoints.reverse()
              let points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints)
              let vertices3d = []
              points2d.map(function (point2d) {
                let point3d = orthobasis.to3D(point2d)
                let vertex3d = new CSG.Vertex(point3d)
                vertices3d.push(vertex3d)
              })
              let polygon = new CSG.Polygon(vertices3d, shared, plane)
              destpolygons.push(polygon)
            }
          }
        } // if(yindex > 0)
        for (let i = 0; i < newoutpolygonrow.length; i++) {
          let thispolygon = newoutpolygonrow[i]
          if (!thispolygon.outpolygon) {
                        // polygon starts here:
            thispolygon.outpolygon = {
              leftpoints: [],
              rightpoints: []
            }
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
            if (thispolygon.topleft.distanceTo(thispolygon.topright) > CSG.EPS) {
                            // we have a horizontal line at the top:
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
            }
          } else {
                        // continuation of a previous row
            if (!thispolygon.leftlinecontinues) {
              thispolygon.outpolygon.leftpoints.push(thispolygon.topleft)
            }
            if (!thispolygon.rightlinecontinues) {
              thispolygon.outpolygon.rightpoints.push(thispolygon.topright)
            }
          }
        }
        prevoutpolygonrow = newoutpolygonrow
      }
    } // for yindex
  } // if(numpolygons > 0)
}

module.exports = {
  fnNumberSort,
  fnSortByIndex,
  IsFloat,
  solve2Linear,
  insertSorted,
  interpolateBetween2DPointsForY,
  reTesselateCoplanarPolygons}
