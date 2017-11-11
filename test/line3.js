import test from 'ava'
import {CSG} from '../csg'
import {CAG} from '../csg'

function planeEquals (t, observed, expected) {
  t.is(observed.w,expected.w)
  return t.deepEqual(observed.normal, expected.normal)
}

function vertexEquals (t, observed, expected) {
  const obs = [observed.pos._x, observed.pos._y, observed.pos._z]
  return t.deepEqual(obs, expected)
}

function vector3Equals (t, observed, expected) {
  const obs = [observed._x, observed._y, observed._z]
  return t.deepEqual(obs, expected)
}

test('CSG.Line3 constructors creates valid lines', t => {
  const Line3 = CSG.Line3D
  const Vector3 = CSG.Vector3D
  const Plane = CSG.Plane

  let l1 = Line3.fromPoints([0,0,0],[10,-10,10])
  let l2 = new Line3(l1.point,l1.direction)

  t.deepEqual(l1, l2)
  t.is(l1.equals(l2),true)

  let a = new Vector3(0,0,0)
  let b = new Vector3(10,10,0)
  let c = new Vector3(-10,10,0)
  let p1 = Plane.fromVector3Ds(a,b,c)
  a = new Vector3(10,0,0)
  b = new Vector3(10,10,0)
  c = new Vector3(10,10,10)
  let p2 = Plane.fromVector3Ds(a,b,c)
  let l3 = Line3.fromPlanes(p1,p2)

  vector3Equals(t,l3.point,[10,0,0])
  vector3Equals(t,l3.direction,[-0,1,0])
})

