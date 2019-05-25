const test = require('ava')

const {geom2, geom3, path2} = require('../../geometry')

const expand = require('./expand')

test('expand: expanding of a path2 produces an expected geom2', t => {
  let points = [
    [10, 0],
    [9.510565162951535, 3.090169943749474],
    [8.090169943749475, 5.877852522924732],
    [5.877852522924732, 8.090169943749475],
    [3.0901699437494745, 9.510565162951535],
    [6.123233995736766e-16, 10]
  ]
  let geometry = path2.fromPoints({}, points)

  // test counter clock wise winding paths
  let obs = expand({delta: 2, segments: 8}, geometry)
  let pts = geom2.toPoints(obs)
  let exp = [
    new Float32Array([ 11.97537612915039, 0.3128691613674164 ]),
    new Float32Array([ 11.485940933227539, 3.40303897857666 ]),
    new Float32Array([ 11.292577743530273, 3.9981508255004883 ]),
    new Float32Array([ 9.872182846069336, 6.785833358764648 ]),
    new Float32Array([ 9.504383087158203, 7.2920660972595215 ]),
    new Float32Array([ 7.2920660972595215, 9.504383087158203 ]),
    new Float32Array([ 6.785833358764648, 9.872182846069336 ]),
    new Float32Array([ 3.9981508255004883, 11.292577743530273 ]),
    new Float32Array([ 3.40303897857666, 11.485940933227539 ]),
    new Float32Array([ 0.3128691613674164, 11.97537612915039 ]),
    new Float32Array([ -1.1755702495574951, 11.618034362792969 ]),
    new Float32Array([ -1.9753766059875488, 10.31286907196045 ]),
    new Float32Array([ -1.6180341243743896, 8.824429512023926 ]),
    new Float32Array([ -0.3128691613674164, 8.02462387084961 ]),
    new Float32Array([ 2.4644322395324707, 7.584741592407227 ]),
    new Float32Array([ 4.687627792358398, 6.451967239379883 ]),
    new Float32Array([ 6.451967239379883, 4.687627792358398 ]),
    new Float32Array([ 7.584741592407227, 2.4644322395324707 ]),
    new Float32Array([ 8.02462387084961, -0.3128691613674164 ]),
    new Float32Array([ 8.824429512023926, -1.6180341243743896 ]),
    new Float32Array([ 10.31286907196045, -1.9753766059875488 ]),
    new Float32Array([ 11.618034362792969, -1.1755702495574951 ])
  ]
  t.deepEqual(pts, exp)

  // test clock wise winding paths
  geometry = path2.fromPoints({}, points.reverse())
  obs = expand({delta: 2, segments: 8}, geometry)
  pts = geom2.toPoints(obs)
  exp = [
    new Float32Array([ 0.3128691613674164, 11.97537612915039 ]),
    new Float32Array([ 3.40303897857666, 11.485940933227539 ]),
    new Float32Array([ 3.9981508255004883, 11.292577743530273 ]),
    new Float32Array([ 6.785833358764648, 9.872182846069336 ]),
    new Float32Array([ 7.2920660972595215, 9.504383087158203 ]),
    new Float32Array([ 9.504383087158203, 7.2920660972595215 ]),
    new Float32Array([ 9.872182846069336, 6.785833358764648 ]),
    new Float32Array([ 11.292577743530273, 3.9981508255004883 ]),
    new Float32Array([ 11.485940933227539, 3.40303897857666 ]),
    new Float32Array([ 11.97537612915039, 0.3128691613674164 ]),
    new Float32Array([ 11.618034362792969, -1.1755702495574951 ]),
    new Float32Array([ 10.31286907196045, -1.9753766059875488 ]),
    new Float32Array([ 8.824429512023926, -1.6180341243743896 ]),
    new Float32Array([ 8.02462387084961, -0.3128691613674164 ]),
    new Float32Array([ 7.584741592407227, 2.4644322395324707 ]),
    new Float32Array([ 6.451967239379883, 4.687627792358398 ]),
    new Float32Array([ 4.687627792358398, 6.451967239379883 ]),
    new Float32Array([ 2.4644322395324707, 7.584741592407227 ]),
    new Float32Array([ -0.3128691613674164, 8.02462387084961 ]),
    new Float32Array([ -1.6180341243743896, 8.824429512023926 ]),
    new Float32Array([ -1.9753766059875488, 10.31286907196045 ]),
    new Float32Array([ -1.1755702495574951, 11.618034362792969 ])
  ]
  t.deepEqual(pts, exp)
})

test('expand: expanding of a geom2 produces expected changes to points', t => {
  let geometry = geom2.fromPoints([[-8, -8], [8, -8], [8, 8], [-8, 8]])

  let obs = expand({delta: 2, segments: 8}, geometry)
  let pts = geom2.toPoints(obs)
  let exp = [
    new Float32Array([ -9.414213180541992, -9.414213180541992 ]),
    new Float32Array([ -8, -10 ]),
    new Float32Array([ 8, -10 ]),
    new Float32Array([ 9.414213180541992, -9.414213180541992 ]),
    new Float32Array([ 10, -8 ]),
    new Float32Array([ 10, 8 ]),
    new Float32Array([ 9.414213180541992, 9.414213180541992 ]),
    new Float32Array([ 8, 10 ]),
    new Float32Array([ -8, 10 ]),
    new Float32Array([ -9.414213180541992, 9.414213180541992 ]),
    new Float32Array([ -10, 8 ]),
    new Float32Array([ -10, -8 ])
  ]
  t.deepEqual(pts, exp)
})

test('expand: expanding of a geom3 produces expected changes to polygons', t => {
  let polygonsAsPoints = [
    [[-5,-5,-5],[-5,-5,15],[-5,15,15],[-5,15,-5]],
    [[15,-5,-5],[15,15,-5],[15,15,15],[15,-5,15]],
    [[-5,-5,-5],[15,-5,-5],[15,-5,15],[-5,-5,15]],
    [[-5,15,-5],[-5,15,15],[15,15,15],[15,15,-5]],
    [[-5,-5,-5],[-5,15,-5],[15,15,-5],[15,-5,-5]],
    [[-5,-5,15],[15,-5,15],[15,15,15],[-5,15,15]]
  ]
  let geometry = geom3.fromPoints(polygonsAsPoints)

  let obs = expand({delta: 2, segments: 8}, geometry)
  let pts = geom3.toPoints(obs)
  let exp0 = [
    new Float32Array([ -7, -5, -5 ]),
    new Float32Array([ -7, -5, 15 ]),
    new Float32Array([ -7, 15, 15 ]),
    new Float32Array([ -7, 15, -5 ])
  ]
  let exp61 = [
    new Float32Array([ 15, -7, 15 ]),
    new Float32Array([ 16.414213180541992, -6.41421365737915, 15 ]),
    new Float32Array([ 16, -6.41421365737915, 16 ])
  ]

  t.is(pts.length, 62)
  t.deepEqual(pts[0], exp0)
  t.deepEqual(pts[61], exp61)
})
