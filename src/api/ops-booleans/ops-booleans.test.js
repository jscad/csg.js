const test = require('ava')
const cuboid = require('../primitives/cuboid')
const sphere = require('../primitives/spheroid')
const rectangle = require('../primitives/rectangle')

const union = require('./union')
const difference = require('./difference')
const intersection = require('./intersection')

test('union (defaults)', t => {
  const op1 = cuboid()
  const op2 = cuboid({size: 10})

  const obs = union(op1, op2)

  t.deepEqual(obs.polygons.length, 6)
})

test('union (more than 2 operands)', t => {
  const op1 = cuboid()
  const op2 = cuboid()
  const op3 = cuboid({size: 10})

  const obs = union(op1, op2, op3)

  t.deepEqual(obs.polygons.length, 6)
})

test('union (complex)', t => {
  const obs = union(
        difference(
           cuboid({size: 3, center: true}),
           sphere({r: 2, center: true})
        ),
        intersection(
            sphere({r: 1.3, center: true}),
            cuboid({size: 2.1, center: true})
        )
     )

  t.deepEqual(obs.polygons.length, 610)
})

test('union (2d & 3d shapes)', t => {
  const op1 = cuboid()
  const op2 = rectangle([10, 2])

  const obs = union({extrude2d: true}, op1, op2)

  t.deepEqual(obs.polygons.length, 6)
})

test('difference (defaults)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = cuboid({size: [1, 1, 10]})

  const obs = difference(op1, op2)

  t.deepEqual(obs.polygons.length, 10)
})

test('difference (more than 2 operands)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = cuboid({size: [1, 1, 10]})
  const op3 = cuboid({size: [3, 3, 10]})

  const obs = difference(op1, op2, op3)

  t.deepEqual(obs.polygons.length, 10)
})

test('difference (2d & 3d shapes)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = rectangle([10, 2])

  const obs = difference(op1, op2)

  t.deepEqual(obs.polygons.length, 6)
})

test('intersection (defaults)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = cuboid({size: [1, 1, 10]})

  const obs = difference(op1, op2)

  t.deepEqual(obs.polygons.length, 10)
})

test('intersection (more than 2 operands)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = cuboid({size: [1, 1, 10]})
  const op3 = cuboid({size: [3, 3, 10]})

  const obs = intersection(op1, op2)

  t.deepEqual(obs.polygons.length, 6)
})

test('intersection (2d & 3d shapes)', t => {
  const op1 = cuboid({size: [10, 10, 1]})
  const op2 = cuboid({size: [1, 1, 10]})

  const obs = intersection(op1, op2)

  t.deepEqual(obs.polygons.length, 6)
})
