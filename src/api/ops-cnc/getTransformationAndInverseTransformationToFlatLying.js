// Get the transformation that transforms this CSG such that it is lying on the z=0 plane,
// as flat as possible (i.e. the least z-height).
// So that it is in an orientation suitable for CNC milling
const getTransformationAndInverseTransformationToFlatLying = function (_csg) {
  if (_csg.polygons.length === 0) {
    let m = new Matrix4x4() // unity
    return [m, m]
  } else {
          // get a list of unique planes in the CSG:
    let csg = _csg.canonicalized()
    let planemap = {}
    csg.polygons.map(function (polygon) {
      planemap[polygon.plane.getTag()] = polygon.plane
    })
          // try each plane in the CSG and find the plane that, when we align it flat onto z=0,
          // gives the least height in z-direction.
          // If two planes give the same height, pick the plane that originally had a normal closest
          // to [0,0,-1].
    let xvector = new Vector3D(1, 0, 0)
    let yvector = new Vector3D(0, 1, 0)
    let zvector = new Vector3D(0, 0, 1)
    let z0connectorx = new Connector([0, 0, 0], [0, 0, -1], xvector)
    let z0connectory = new Connector([0, 0, 0], [0, 0, -1], yvector)
    let isfirst = true
    let minheight = 0
    let maxdotz = 0
    let besttransformation, bestinversetransformation
    for (let planetag in planemap) {
      let plane = planemap[planetag]
      let pointonplane = plane.normal.times(plane.w)
      let transformation, inversetransformation
              // We need a normal vecrtor for the transformation
              // determine which is more perpendicular to the plane normal: x or y?
              // we will align this as much as possible to the x or y axis vector
      let xorthogonality = plane.normal.cross(xvector).length()
      let yorthogonality = plane.normal.cross(yvector).length()
      if (xorthogonality > yorthogonality) {
                  // x is better:
        let planeconnector = new Connector(pointonplane, plane.normal, xvector)
        transformation = planeconnector.getTransformationTo(z0connectorx, false, 0)
        inversetransformation = z0connectorx.getTransformationTo(planeconnector, false, 0)
      } else {
                  // y is better:
        let planeconnector = new Connector(pointonplane, plane.normal, yvector)
        transformation = planeconnector.getTransformationTo(z0connectory, false, 0)
        inversetransformation = z0connectory.getTransformationTo(planeconnector, false, 0)
      }
      let transformedcsg = csg.transform(transformation)
      let dotz = -plane.normal.dot(zvector)
      let bounds = transformedcsg.getBounds()
      let zheight = bounds[1].z - bounds[0].z
      let isbetter = isfirst
      if (!isbetter) {
        if (zheight < minheight) {
          isbetter = true
        } else if (zheight === minheight) {
          if (dotz > maxdotz) isbetter = true
        }
      }
      if (isbetter) {
                  // translate the transformation around the z-axis and onto the z plane:
        let translation = new Vector3D([-0.5 * (bounds[1].x + bounds[0].x), -0.5 * (bounds[1].y + bounds[0].y), -bounds[0].z])
        transformation = transformation.multiply(Matrix4x4.translation(translation))
        inversetransformation = Matrix4x4.translation(translation.negated()).multiply(inversetransformation)
        minheight = zheight
        maxdotz = dotz
        besttransformation = transformation
        bestinversetransformation = inversetransformation
      }
      isfirst = false
    }
    return [besttransformation, bestinversetransformation]
  }
}

module.exports = {getTransformationAndInverseTransformationToFlatLying}
