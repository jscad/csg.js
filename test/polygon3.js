import test from 'ava'
import {CSG} from '../csg'

function vertexEquals (t, observed, expected) {
  const obs = [observed.pos._x, observed.pos._y, observed.pos._z]
  return t.deepEqual(obs, expected)
}

function vector3Equals (t, observed, expected) {
  const obs = [observed._x, observed._y, observed._z]
  return t.deepEqual(obs, expected)
}

test('CSG.Polygon3 constructor creates a 3D polygon', t => {
  const Vertex3 = CSG.Vertex
  const Vector3 = CSG.Vector3D
  const Polygon = CSG.Polygon

  const vertices = [
    new Vertex3(new Vector3([0, 0, 0])), // you gotta be kidding me ...WAY too complex for what it is
    new Vertex3(new Vector3([0, 10, 0])),
    new Vertex3(new Vector3([0, 10, 10]))
  ]
  let observed = new Polygon(vertices)

  t.deepEqual(observed.vertices.length, 3)
  vertexEquals(t, observed.vertices[0], [0, 0, 0])
  vertexEquals(t, observed.vertices[1], [0, 10, 0])
  vertexEquals(t, observed.vertices[2], [0, 10, 10])
  vector3Equals(t, observed.plane.normal, [1, 0, 0])

  const shared = CSG.Polygon.defaultShared
  const plane = CSG.Plane.fromVector3Ds(vertices[0].pos,vertices[1].pos,vertices[2].pos)

  observed = new Polygon(vertices,shared,plane)

  t.deepEqual(observed.vertices.length, 3)
  vertexEquals(t, observed.vertices[0], [0, 0, 0])
  vertexEquals(t, observed.vertices[1], [0, 10, 0])
  vertexEquals(t, observed.vertices[2], [0, 10, 10])
  vector3Equals(t, observed.plane.normal, [1, 0, 0])
})

test('CSG.Polygon3 createsFromPoints a 3D polygon', t => {
  const Vertex3 = CSG.Vertex
  const Vector3 = CSG.Vector3D
  const Polygon = CSG.Polygon

  const points = [
    [0,  0, 0],
    [0, 10, 0],
    [0, 10, 10]
  ]
  const vectors = [
    new Vector3([0,  0, 0]),
    new Vector3([0, 10, 0]),
    new Vector3([0, 10, 10])
  ]

  let observed = Polygon.createFromPoints(points)

  t.deepEqual(observed.vertices.length, 3)
  vertexEquals(t, observed.vertices[0], [0, 0, 0])
  vertexEquals(t, observed.vertices[1], [0, 10, 0])
  vertexEquals(t, observed.vertices[2], [0, 10, 10])

  const shared = CSG.Polygon.defaultShared
  const plane = CSG.Plane.fromVector3Ds(vectors[0],vectors[1],vectors[2])

  observed = Polygon.createFromPoints(points,shared,plane)

  t.deepEqual(observed.vertices.length, 3)
  vertexEquals(t, observed.vertices[0], [0, 0, 0])
  vertexEquals(t, observed.vertices[1], [0, 10, 0])
  vertexEquals(t, observed.vertices[2], [0, 10, 10])

// and excercise features
  const volume   = observed.getSignedVolume()
  const area     = observed.getArea()
  const features = observed.getTetraFeatures(['volume','area','junk'])
  const bsphere  = observed.boundingSphere()
  const bbox     = observed.boundingBox()

  t.is(volume,0)
  t.is(area,50)
  t.deepEqual(features,[0,50])
  t.deepEqual(bsphere,[new Vector3([0,5,5]),7.0710678118654755])
  t.deepEqual(bbox,[new Vector3([0,0,0]),new Vector3([0,10,10])])
})

// checkIfConvex() // throws new Error if not
// this setColor(args)

// Polygon = translate(offset)
// Polygon = transform(matrix4x4)
// Polygon = flipped()


// String = toString()
// CAG = projectToOrthoNormalBasis(orthobasis)

// CSG = extrude(offsetvector)
// CSG = solidFromSlices(options)

test('CSG.Polygon.Shared construction', t => {
  let s1 = new CSG.Polygon.Shared( [1,2,3,4] )

  t.deepEqual(s1.color,[1,2,3,4])

  let o2 = {color: [4,3,2,1] }
  let s2 = CSG.Polygon.Shared.fromObject(o2)

  t.deepEqual(s2.color,[4,3,2,1])

  let s3 = CSG.Polygon.Shared.fromColor(9,8,7,6)

  t.deepEqual(s3.color,[9,8,7,6])

  let s4 = CSG.Polygon.Shared.fromColor([6,7,8,9])

  t.deepEqual(s4.color,[6,7,8,9])

// check that generic objects are possible via JSON
  let o5 = JSON.parse(JSON.stringify(s4))
  let s5 = CSG.Polygon.Shared.fromObject(o5)

  t.deepEqual(o5,JSON.parse(JSON.stringify(s5)))

// check member functions
  let h1 = s1.getHash()
  let h2 = s2.getHash()
  let h3 = s3.getHash()
  let h4 = s4.getHash()

  t.is(h1,'1/2/3/4')
  t.is(h2,'4/3/2/1')
  t.is(h3,'9/8/7/6')
  t.is(h4,'6/7/8/9')

  let t1 = s1.getTag()
  let t2 = s2.getTag()
  let t3 = s3.getTag()
  let t4 = s4.getTag()

  t.is(t1,1)
  t.is(s1.tag,1)
  t.is(s1.getTag(),1)

  t.is(t4,4)
  t.is(s4.tag,4)
  t.is(s4.getTag(),4)

})

