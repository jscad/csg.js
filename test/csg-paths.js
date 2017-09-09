import test from 'ava'
import {CSG} from '../csg'
import {OBJ} from './helpers/obj-store'
import {assertSameGeometry} from './helpers/asserts'

// Testing common shape generation can only be done by comparing
// with previously human validated shapes. It would be trivially
// rewriting the generation code to test it with code instead.

function isValid (t, name, observed) {
  const expected = OBJ.loadPrevious('csg-shapes.' + name, observed)
  assertSameGeometry(t, observed, expected)
}

test('CSG.Path2D constructor creates an empty path', t => {
  let p1 = new CSG.Path2D()

  t.is(typeof p1, 'object')
  t.false(p1.isClosed())
  t.is(p1.getPoints().length,0)

// make sure methods work on empty paths
  let p2 = new CSG.Path2D()
  let p3 = p1.concat(p2)

  t.false(p3.isClosed())
  t.is(p3.getPoints().length,0)

  let matrix = CSG.Matrix4x4.rotationX(90)
  p3 = p2.transform(matrix)

  t.false(p3.isClosed())
  t.is(p3.getPoints().length,0)

  p3 = p2.appendPoint([1,1])

  t.false(p3.isClosed())
  t.is(p3.getPoints().length,1)
  t.false(p2.isClosed())
  t.is(p2.getPoints().length,0)

  p3 = p2.appendPoints(p1.getPoints())

  t.false(p3.isClosed())
  t.is(p3.getPoints().length,0)

// test that close is possible
  let p4 = p3.close()

  t.true(p4.isClosed())
  t.is(p4.getPoints().length,0)

})

test('CSG.Path2D.arc() creates correct paths', t => {
// test default options
  let a1 = CSG.Path2D.arc()
  let p1 = a1.getPoints()

  t.false(a1.isClosed())
  t.is(p1.length,34)
  t.deepEqual(p1[0],new CSG.Vector2D([1,0]))

// test center
  let a2 = CSG.Path2D.arc({center: [5,5]})
  let p2 = a2.getPoints()

  t.false(a2.isClosed())
  t.is(p2.length,34)
  t.deepEqual(p2[0],new CSG.Vector2D([6,5]))

// test radius (with center)
  let a3 = CSG.Path2D.arc({center: [5,5],radius: 10})
  let p3 = a3.getPoints()

  t.false(a3.isClosed())
  t.is(p3.length,34)
  t.deepEqual(p3[0],new CSG.Vector2D([15,5]))

// test start angle (with radius)
  let a4 = CSG.Path2D.arc({radius: 10,startangle: 180})
  let p4 = a4.getPoints()

  t.false(a4.isClosed())
  t.is(p4.length,18)
  //t.deepEqual(p4[0],new CSG.Vector2D([10,0]))

// test end angle (with center)
  let a5 = CSG.Path2D.arc({center: [5,5],endangle: 90})
  let p5 = a5.getPoints()

  t.false(a5.isClosed())
  t.is(p5.length,10)
  t.deepEqual(p5[0],new CSG.Vector2D([6,5]))

// test resolution (with radius)
  let a6 = CSG.Path2D.arc({radius: 10,resolution: 144})
  let p6 = a6.getPoints()

  t.false(a6.isClosed())
  t.is(p6.length,146)
  t.deepEqual(p6[0],new CSG.Vector2D([10,0]))

// test make tangent (with radius)
  let a7 = CSG.Path2D.arc({radius: 10,maketangent: true})
  let p7 = a7.getPoints()

  t.false(a7.isClosed())
  t.is(p7.length,36)
  t.deepEqual(p7[0],new CSG.Vector2D([10,0]))
})


