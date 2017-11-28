const {fromPoints} = require('../../CAGFactories')
const Vector2D = require('../../math/Vector2')

/** cag = cag.overCutInsideCorners(cutterradius);
 * Using a CNC router it's impossible to cut out a true sharp inside corner. The inside corner
 * will be rounded due to the radius of the cutter. This function compensates for this by creating
 * an extra cutout at each inner corner so that the actual cut out shape will be at least as large
 * as needed.
 * @param {Object} _cag - input cag
 * @param {Float} cutterradius - radius to cut inside corners by
 * @returns {CAG} cag with overcutInsideCorners
 */
const overCutInsideCorners = function (_cag, cutterradius) {
  let cag = _cag.canonicalized()
  // for each vertex determine the 'incoming' side and 'outgoing' side:
  let pointmap = {} // tag => {pos: coord, from: [], to: []}
  cag.sides.map(function (side) {
    if (!(side.vertex0.getTag() in pointmap)) {
      pointmap[side.vertex0.getTag()] = {
        pos: side.vertex0.pos,
        from: [],
        to: []
      }
    }
    pointmap[side.vertex0.getTag()].to.push(side.vertex1.pos)
    if (!(side.vertex1.getTag() in pointmap)) {
      pointmap[side.vertex1.getTag()] = {
        pos: side.vertex1.pos,
        from: [],
        to: []
      }
    }
    pointmap[side.vertex1.getTag()].from.push(side.vertex0.pos)
  })
          // overcut all sharp corners:
  let cutouts = []
  for (let pointtag in pointmap) {
    let pointobj = pointmap[pointtag]
    if ((pointobj.from.length === 1) && (pointobj.to.length === 1)) {
                  // ok, 1 incoming side and 1 outgoing side:
      let fromcoord = pointobj.from[0]
      let pointcoord = pointobj.pos
      let tocoord = pointobj.to[0]
      let v1 = pointcoord.minus(fromcoord).unit()
      let v2 = tocoord.minus(pointcoord).unit()
      let crossproduct = v1.cross(v2)
      let isInnerCorner = (crossproduct < 0.001)
      if (isInnerCorner) {
                      // yes it's a sharp corner:
        let alpha = v2.angleRadians() - v1.angleRadians() + Math.PI
        if (alpha < 0) {
          alpha += 2 * Math.PI
        } else if (alpha >= 2 * Math.PI) {
          alpha -= 2 * Math.PI
        }
        let midvector = v2.minus(v1).unit()
        let circlesegmentangle = 30 / 180 * Math.PI // resolution of the circle: segments of 30 degrees
                      // we need to increase the radius slightly so that our imperfect circle will contain a perfect circle of cutterradius
        let radiuscorrected = cutterradius / Math.cos(circlesegmentangle / 2)
        let circlecenter = pointcoord.plus(midvector.times(radiuscorrected))
                      // we don't need to create a full circle; a pie is enough. Find the angles for the pie:
        let startangle = alpha + midvector.angleRadians()
        let deltaangle = 2 * (Math.PI - alpha)
        let numsteps = 2 * Math.ceil(deltaangle / circlesegmentangle / 2) // should be even
                      // build the pie:
        let points = [circlecenter]
        for (let i = 0; i <= numsteps; i++) {
          let angle = startangle + i / numsteps * deltaangle
          let p = Vector2D.fromAngleRadians(angle).times(radiuscorrected).plus(circlecenter)
          points.push(p)
        }
        cutouts.push(fromPoints(points))
      }
    }
  }
  return cag.subtract(cutouts)
}

module.exports = overCutInsideCorners
