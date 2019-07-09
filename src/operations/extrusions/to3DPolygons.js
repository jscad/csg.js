const { geom3 } = require('../../geometry')

const measureBounds = require('../measures/measureBounds')

const to3DWalls = require('../booleans/to3DWalls')
const intersectGeom3Sub = require('../booleans/intersectGeom3Sub')

const to3DPolygons = (options, geometry2) => {
  const defaults = {
    flipped: false
  }
  const { flipped } = Object.assign({}, defaults, options)

  // convert the 2D geometry to 3D walls
  const walls = to3DWalls({ z0: -1, z1: 1 }, geometry2)

  // create one HUGE polygon to encompass the 2D geometry
  const bounds = measureBounds(geometry2)
  const min = bounds[0]
  const max = bounds[1]
  let floor = geom3.fromPoints([[min, [max[0], min[1], 0], max, [min[0], max[1], 0]]])
  if (flipped) {
    floor = geom3.invert(floor)
  }
  // create an insection of the floor and the walls, creating... a 3D version of the 2D geometry
  const geometry3 = intersectGeom3Sub(floor, walls)

  // return the filtered polygons
  let polygons = geom3.toPolygons(geometry3)
  polygons = polygons.filter((polygon) => (Math.abs(polygon.plane[2]) > 0.99))
  return polygons
}

module.exports = to3DPolygons
