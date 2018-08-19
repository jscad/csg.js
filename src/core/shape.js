const vec3 = require('./math/vec3')
// EXPERIMENTING
const makeShape = () => {
  return {
    geometry: {
      sides: [],
      isCanonicalized: false
    },
    properties: {},
    transforms: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    }
  }
}

const translate = (vector, shape) => {
  const position = vec3.add(vector, shape.transforms.position)
  const transforms = Object.assign({}, shape.transforms, {position})
  return Object.assign({}, shape, {transforms})
}

const rotate = (vector, shape) => {
  const rotation = vec3.rotate(vector, shape.transforms.rotation)
  const transforms = Object.assign({}, shape.transforms, {rotation})
  return Object.assign({}, shape, {transforms})
}

const scale = (vector, shape) => {
  const scale = vec3.multiply(vector, shape.transforms.scale)
  const transforms = Object.assign({}, shape.transforms, {scale})
  return Object.assign({}, shape, {transforms})
}

////
const originalShape = makeShape()

const moved = translate([0, 2, 1], originalShape)

console.log('original', originalShape)
console.log('moved', moved)

const scaled = scale([0.5, 2, 1], moved)
console.log('scaled', scaled)

//const rotated = rotate([0, 90, 0], moved)
//console.log('rotated', rotated)
