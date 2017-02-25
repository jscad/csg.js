import test from 'ava'
import { cube, sphere, cylinder } from './primitives3d'
import { square, circle } from './primitives2d'
import { color, rgb2hsl, hsl2rgb, rgb2hsv, hsv2rgb } from './color'

test('rgb2hsl', t => {
  const obs = rgb2hsl(1, 0, 0)
  const expColor = [0, 1, 0.5]

  t.deepEqual(obs, expColor)
})

test('hsl2rgb', t => {
  const obs = hsl2rgb(0, 1, 0)
  const expColor = [0, 0, 0]

  t.deepEqual(obs, expColor)
})

test('rgb2hsv', t => {
  const obs = rgb2hsv(1, 0, 0.5)
  const expColor = [0.9166666666666666, 1, 1]

  t.deepEqual(obs, expColor)
})

test('hsv2rgb', t => {
  const obs = hsv2rgb(0, 0.2, 0)
  const expColor = [0, 0, 0]

  t.deepEqual(obs, expColor)
})

test('color (rgb, on 3d objects)', t => {
  const obs = color([1, 0, 0], cube(), sphere())
  const expColor = { color: [ 1, 0, 0, 1 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (rgb, on 2d objects)', t => {
  const obs = color([1, 0, 0], square(), circle())
  const expColor = { color: [ 1, 0, 0, 1 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})

test('color (rgba, on 3d objects)', t => {
  const obs = color([1, 0, 0, 0.5], cube(), sphere())
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (rgba, on 2d objects)', t => {
  const obs = color([1, 0, 0, 0.5], square(), circle())
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})

test('color (rgba, on array of 3D objects)', t => {
  const obs = color([1, 0, 0, 0.5], [cube(), sphere()])
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (rgba, on array of 2d objects)', t => {
  const obs = color([1, 0, 0, 0.5], [square(), circle()])
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})

test('color (by name, on 3d objects)', t => {
  var obs = color('red', cube())
  var expColor = { color: [ 1, 0, 0, 1 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)

  obs = color('green', cube(), sphere())
  expColor = { color: [ 0, 128 / 255, 0, 1 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)

  obs = color('blue', cube(), sphere(), cylinder())
  expColor = { color: [ 0, 0, 1, 1 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (by name, on 2d objects)', t => {
  const obs = color('red', square(), circle())
  const expColor = { color: [ 1, 0, 0, 1 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})

test('color (by name and alpha, on 3d objects)', t => {
  var obs = color('red', 0.5, cube())
  var expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)

  obs = color('green', 0.8, cube(), sphere())
  expColor = { color: [ 0, 128 / 255, 0, 0.8 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)

  obs = color('blue', 0.2, cube(), sphere(), cylinder(())
  expColor = { color: [ 0, 0, 1, 0.2 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (by name and alpha, on 2d objects)', t => {
  const obs = color('red', 0.1, square(), circle())
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})

test('color (by name and alpha, on array of 3d objects)', t => {
  const obs = color('red', 0.7, [cube(), sphere()])
  const expColor = { color: [ 1, 0, 0, 0.7 ] }

  t.deepEqual(obs.polygons[0].shared, expColor)
  t.deepEqual(obs.polygons[obs.polygons.length - 1].shared, expColor)
})

test('color (by name and alpha, on array of 2d objects)', t => {
  const obs = color('red', 0.5, [square(), circle()])
  const expColor = { color: [ 1, 0, 0, 0.5 ] }

  t.deepEqual(obs.sides[0].shared, expColor)
  t.deepEqual(obs.sides[obs.sides.length - 1].shared, expColor)
})
