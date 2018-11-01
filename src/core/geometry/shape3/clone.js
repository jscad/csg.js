const geom3 = require('./geom3')
const mat4 = require('../../math/mat4')
const create = require('./create')

const clone = sourceShape => {
  const newShape = create()
  newShape.geometry = geom3.clone(sourceShape.geometry)
  newShape.transforms = mat4.clone(sourceShape.transforms)
  newShape.properties = { ...sourceShape.properties }
}
