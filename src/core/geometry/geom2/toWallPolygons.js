const toVec3Pairs = require('../../shape2/toVec3Pairs')

/*
* given 2 connectors, this returns all polygons of a "wall" between 2
* copies of this geometry, positioned in 3d space as "bottom" and
* "top" plane per connectors toConnector1, and toConnector2, respectively
*/
const toWallPolygons = function (input, options) {
  // normals are going to be correct as long as toConn2.point - toConn1.point
  // points into geometry normal direction (check in caller)
  // arguments: options.toConnector1, options.toConnector2, options.geometry
  //     walls go from toConnector1 to toConnector2
  //     optionally, target geometry to point to - geometry needs to have same number of sides as this!
  let origin = [0, 0, 0]
  let defaultAxis = [0, 0, 1]
  let defaultNormal = [0, 1, 0]
  let thisConnector = new Connector(origin, defaultAxis, defaultNormal)
  // arguments:
  let toConnector1 = options.toConnector1
  // let toConnector2 = new Connector([0, 0, -30], defaultAxis, defaultNormal);
  let toConnector2 = options.toConnector2
  if (!(toConnector1 instanceof Connector && toConnector2 instanceof Connector)) {
    throw new Error('could not parse Connector arguments toConnector1 or toConnector2')
  }
  if (options.geometry) {
    if (options.geometry.sides.length !== this.sides.length) {
      throw new Error('target geometry needs same sides count as start geometry')
    }
  }
  // target geometry is same as this unless specified
  let toCag = options.geometry || input
  let m1 = thisConnector.getTransformationTo(toConnector1, false, 0)
  let m2 = thisConnector.getTransformationTo(toConnector2, false, 0)
  let vps1 = toVec3Pairs(input, m1)
  let vps2 = toVec3Pairs(toCag, m2)

  let polygons = []
  vps1.forEach(function (vp1, i) {
    polygons.push(new Polygon3([
      new Vertex3D(vps2[i][1]), new Vertex3D(vps2[i][0]), new Vertex3D(vp1[0])]))
    polygons.push(new Polygon3([
      new Vertex3D(vps2[i][1]), new Vertex3D(vp1[0]), new Vertex3D(vp1[1])]))
  })
  return polygons
}

module.exports = toWallPolygons
