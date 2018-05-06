const test = require('ava')
const { vector_text, vector_char, vectorChar, vectorText } = require('./text')

test('vector_char', t => {
  const obs = vector_char(0, 2, 'O')
  const expSegments = [ [ [ 9, 23 ],
    [ 7, 22 ],
    [ 5, 20 ],
    [ 4, 18 ],
    [ 3, 15 ],
    [ 3, 10 ],
    [ 4, 7 ],
    [ 5, 5 ],
    [ 7, 3 ],
    [ 9, 2 ],
    [ 13, 2 ],
    [ 15, 3 ],
    [ 17, 5 ],
    [ 18, 7 ],
    [ 19, 10 ],
    [ 19, 15 ],
    [ 18, 18 ],
    [ 17, 20 ],
    [ 15, 22 ],
    [ 13, 23 ],
    [ 9, 23 ] ] ]

  t.deepEqual(obs.width, 22)
  t.deepEqual(obs.height, 21)
  t.deepEqual(obs.segments, expSegments)
})

test('vector_text', t => {
  const obs = vector_text(0, 0, 'Hi')
  const exp = [ [ [ 4, 21 ], [ 4, 0 ] ],
    [ [ 18, 21 ], [ 18, 0 ] ],
    [ [ 4, 11 ], [ 18, 11 ] ],
    [ [ 25, 21 ], [ 26, 20 ], [ 27, 21 ], [ 26, 22 ], [ 25, 21 ] ],
    [ [ 26, 14 ], [ 26, 0 ] ] ]

  t.deepEqual(obs, exp)
})

test('vectorChar (defaults)', t => {
  const obs = vectorChar()
  const expSegments = [
    [[3,16],[3,17],[4,19],[5,20],[7,21],[11,21],[13,20],[14,19],[15,17],[15,15],[14,13],[13,12],[9,10],[9,7]],
    [[9,2],[8,1],[9,0],[10,1],[9,2]]
  ]

  t.deepEqual(obs.width, 18)
  t.deepEqual(obs.height, 21)
  t.deepEqual(obs.segments, expSegments)
})

test('vectorChar (char)', t => {
  const obs = vectorChar('H')
  const expSegments = [
    [[4,21],[4,0]],
    [[18,21],[18,0]],
    [[4,11],[18,11]]
  ]

  t.deepEqual(obs.width, 22)
  t.deepEqual(obs.height, 21)
  t.deepEqual(obs.segments, expSegments)
})

test('vectorChar ({ x, y }, char)', t => {
  const obs = vectorChar({ x: 10, y: 20 }, 'H')
  const expSegments = [
    [[14,41],[14,20]],
    [[28,41],[28,20]],
    [[14,31],[28,31]]
  ]

  t.deepEqual(obs.width, 22)
  t.deepEqual(obs.height, 21)
  t.deepEqual(obs.segments, expSegments)
})

test('vectorChar ({ height }, char)', t => {
  const obs = vectorChar({ height: 10, input: 'H' })
  const expSegments = [
    [[1.9047619047619047,10],[1.9047619047619047,0]],
    [[8.571428571428571,10],[8.571428571428571,0]],
    [[1.9047619047619047,5.238095238095238],[8.571428571428571,5.238095238095238]]
  ]

  t.deepEqual(obs.width, 10.476190476190476)
  t.deepEqual(obs.height, 10)
  t.deepEqual(obs.segments, expSegments)
})

// ! circular dependencies
test.failing('vectorChar ({ height, extrude }, char)', t => {
  const obs = vectorChar({ height: 10, extrude: { w: 2, h: 2 } }, 'H')

  t.deepEqual(obs.polygons.length, 34)
})
