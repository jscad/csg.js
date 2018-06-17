import test from 'ava'
import {CSG, CAG} from '../csg'
import {nearlyEquals, CAGNearlyEquals} from './helpers/asserts'

//
// Test suite for CAG measurements
// - verify measurements for new CAG ("empty")
// - verify measurements for CAG primitives shapes
// - verify measurements for complex CAG shapes
//
test('New CAG measurements', t => {
  const cag = new CAG()

// area
  let area = cag.area()
  t.is(area, 0)

// bounds
  let bounds = cag.getBounds()
  let min = bounds[0]
  t.is(min.x, 0)
  t.is(min.y, 0)
  let max = bounds[1]
  t.is(max.x, 0)
  t.is(max.y, 0)

// center
})

test('CAG rectangle measurements', t => {
  let cag1 = CAG.rectangle() // radius: 1

// area
  let area = cag1.area()
  t.is(area, 4)

// bounds
  let bounds = cag1.getBounds()
  let min = bounds[0]
  t.is(min.x, -1)
  t.is(min.y, -1)
  let max = bounds[1]
  t.is(max.x, 1)
  t.is(max.y, 1)

// and transformed
  let cag2 = cag1.translate([5,5]).rotateZ(45)

  area = cag2.area()
  t.true(nearlyEquals(area, 4))
})

test('CAG circle measurements', t => {
  let cag1 = CAG.circle() // radius: 1

  let area = cag1.area()
  t.true(nearlyEquals(area, 3.1214, 0.0001))

  let cag2 = cag1.translate([5,5]).rotateZ(5)

  area = cag2.area()
  t.true(nearlyEquals(area, 3.1214, 0.0001))
})

test('CAG complex (multiple parts) measurements', t => {
  let cag1 = CAG.rectangle() // radius: 1
  let cag2 = cag1.union(cag1.translate([5,5]).rotateZ(45))

  let area = cag2.area()
  t.true(nearlyEquals(area, 8, 0.0001))
})

test('CAG complex (multiple hole) measurements', t => {
  let cag1 = CAG.rectangle() // radius: 1
  let cag2 = CAG.rectangle({radius: 10})
  let cag3 = cag2.subtract(cag1.translate([5,5]).rotateZ(45))

  let area = cag3.area()
  t.true(nearlyEquals(area, 396, 0.0001))

  let cag4 = cag3.subtract(cag1.translate([5,5]).rotateZ(-90))

  area = cag4.area()
  t.true(nearlyEquals(area, 392, 0.0001))

  let cag10 = CAG.circle({radius: 25, resolution: 360})
  area = cag10.area()
  t.true(nearlyEquals(area, 1963.3957, 0.0001))

  let cag11 = CAG.circle({radius: 3, resolution: 72, center: [5,5]})
  area = cag11.area()
  t.true(nearlyEquals(area, 28.2384, 0.0001))

  let cag12 = cag10.subtract(cag11).subtract(cag11.rotateZ(180))

  area = cag12.area()
  t.true(nearlyEquals(area, 1906.9188, 0.0001))
})


