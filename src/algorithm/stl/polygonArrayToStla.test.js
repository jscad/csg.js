const polygonArrayToStla = require('./polygonArrayToStla')
const test = require('ava')

const box1Polygons =
    [
      [[-5, -5, -5], [-5, -5,  5], [-5,  5,  5], [-5,  5, -5]],
      [[ 5, -5, -5], [ 5,  5, -5], [ 5,  5,  5], [ 5, -5,  5]],
      [[-5, -5, -5], [ 5, -5, -5], [ 5, -5,  5], [-5, -5,  5]],
      [[-5,  5, -5], [-5,  5,  5], [ 5,  5,  5], [ 5,  5, -5]],
      [[-5, -5, -5], [-5,  5, -5], [ 5,  5, -5], [ 5, -5, -5]],
      [[-5, -5,  5], [ 5, -5,  5], [ 5,  5,  5], [-5,  5,  5]]
    ]

const box1Stla = 
`solid JSCAD
facet normal -1 0 0
outer loop
vertex -5 -5 -5
vertex -5 -5 5
vertex -5 5 5
endloop
endfacet
facet normal -1 0 0
outer loop
vertex -5 -5 -5
vertex -5 5 5
vertex -5 5 -5
endloop
endfacet
facet normal 1 0 0
outer loop
vertex 5 -5 -5
vertex 5 5 -5
vertex 5 5 5
endloop
endfacet
facet normal 1 0 0
outer loop
vertex 5 -5 -5
vertex 5 5 5
vertex 5 -5 5
endloop
endfacet
facet normal 0 -1 0
outer loop
vertex -5 -5 -5
vertex 5 -5 -5
vertex 5 -5 5
endloop
endfacet
facet normal 0 -1 0
outer loop
vertex -5 -5 -5
vertex 5 -5 5
vertex -5 -5 5
endloop
endfacet
facet normal 0 1 0
outer loop
vertex -5 5 -5
vertex -5 5 5
vertex 5 5 5
endloop
endfacet
facet normal 0 1 0
outer loop
vertex -5 5 -5
vertex 5 5 5
vertex 5 5 -5
endloop
endfacet
facet normal 0 0 -1
outer loop
vertex -5 -5 -5
vertex -5 5 -5
vertex 5 5 -5
endloop
endfacet
facet normal 0 0 -1
outer loop
vertex -5 -5 -5
vertex 5 5 -5
vertex 5 -5 -5
endloop
endfacet
facet normal 0 0 1
outer loop
vertex -5 -5 5
vertex 5 -5 5
vertex 5 5 5
endloop
endfacet
facet normal 0 0 1
outer loop
vertex -5 -5 5
vertex 5 5 5
vertex -5 5 5
endloop
endfacet
endsolid JSCAD
`

test('Correctly render a box', t => {
  t.is(polygonArrayToStla({}, box1Polygons), box1Stla)
})
