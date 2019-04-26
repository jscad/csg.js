const test = require('ava')

const geom2 = require('../geometry/geom2')

const {polygon} = require('./index')

const comparePoints = require('../../test/helpers/comparePoints')

test('polygon: providing only points (array) creates expected geometry', t => {
  const geo = polygon([[0, 0], [100, 0], [130, 50], [30, 50]])

  const obs = geom2.toPoints(geo)
  const exp = [[0, 0], [100, 0], [130, 50], [30, 50]]

  t.true(comparePoints(obs, exp))
})

test('polygon: providing points (array) and path (array) creates expected geometry', t => {
  const geo = polygon([[0, 0], [100, 0], [130, 50], [30, 50]], [[3, 2, 1, 0]])

  const obs = geom2.toPoints(geo)
  const exp = [[30, 50], [130, 50], [100, 0], [0, 0]]

  t.true(comparePoints(obs, exp))
})

test('polygon: providing points (array) and object.path (array) creates expected geometry', t => {
  const geo = polygon([[0, 0], [100, 0], [130, 50], [30, 50]], {paths: [[3, 2, 1, 0]]})

  const obs = geom2.toPoints(geo)
  const exp = [[30, 50], [130, 50], [100, 0], [0, 0]]

  t.true(comparePoints(obs, exp))
})

test('polygon: providing object.points (array) and object.path (array) creates expected geometry', t => {
  const geo = polygon({points: [[0, 0], [100, 0], [130, 50], [30, 50]], paths: [[3, 2, 1, 0]]})

  const obs = geom2.toPoints(geo)
  const exp = [[30, 50], [130, 50], [100, 0], [0, 0]]

  t.true(comparePoints(obs, exp))
})

test('polygon: providing points (array) and paths (multiple arrays) creates expected geometry', t => {
  const geo = polygon([[0,0],[100,0],[0,100],[10,10],[80,10],[10,80]], [[0,1,2],[3,4,5]])

  const obs = geom2.toPoints(geo)
  const exp = [[0, 0], [100, 0], [10, 80], [10, 10], [80, 10], [0, 100]]

  t.true(comparePoints(obs, exp))
})
