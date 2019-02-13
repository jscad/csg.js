const mat4 = require('../mat4')
const vec3 = require('../vec3')
const { X, Y, Z, W } = require('../constants')

const toXYPlaneTransforms = (plane, rightVector) => {
  if (rightVector === undefined) {
    rightVector = vec3.random(plane)
  }

  const v = vec3.unit(vec3.cross(plane, rightVector))
  const u = vec3.cross(v, plane)
  const p = vec3.multiply(plane, vec3.fromScalar(plane[W]))

  return {
    toXYPlane: mat4.fromValues(
                   u[X], v[X], plane[X], 0,
                   u[Y], v[Y], plane[Y], 0,
                   u[Z], v[Z], plane[Z], 0,
                   0, 0, -plane[W], 1),
    fromXYPlane: mat4.fromValues(
                   u[X], u[Y], u[Z], 0,
                   v[X], v[Y], v[Z], 0,
                   plane[X], plane[Y], plane[Z], 0,
                   p[X], p[Y], p[Z], 1)
  }
}

module.exports = toXYPlaneTransforms
