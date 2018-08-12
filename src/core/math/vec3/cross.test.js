const test = require('ava')
const {cross, fromValues} = require('./index')

test.only('vec3: cross() called with two paramerters should return a vec3 with correct values', t => {

  const obs1 = cross([0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)

  const obs2 = cross([5, 5, 5], [10, 20, 30])
  const exp2 = fromValues(50.000000000, -100.000000000, 50.000000000)
  t.deepEqual(obs2, exp2)

  const obs3 = cross([5, 5, 5], [10, -20, 30])
  const exp3 = fromValues(250.000000000, -100.000000000, -150.000000000)
  t.deepEqual(obs3, exp3)

  const obs4 = cross([5, 5, 5], [-10, -20, 30])
  const exp4 = fromValues(250.000000000, -200.000000000, -50.000000000)
  t.deepEqual(obs4, exp4)

  const obs5 = cross([5, 5, 5], [-10, 20, 30])
  const exp5 = fromValues(50.000000000, -200.000000000, 150.0000000000)
  t.deepEqual(obs5, exp5)

  const obs6 = cross([5, 5, 5], [10, 20, -30])
  const exp6 = fromValues(-250.000000000, 200.000000000, 50.000000000)
  t.deepEqual(obs6, exp6)

  const obs7 = cross([5, 5, 5], [10, -20, -30])
  const exp7 = fromValues(-50.000000000, 200.000000000, -150.000000000)
  t.deepEqual(obs7, exp7)

  const obs8 = cross([5, 5, 5], [-10, -20, -30])
  const exp8 = fromValues(-50.000000000, 100.000000000, -50.000000000)
  t.deepEqual(obs8, exp8)

  const obs9 = cross([5, 5, 5], [-10, 20, -30])
  const exp9 = fromValues(-250.000000000, 100.000000000, 150.0000000000)
  t.deepEqual(obs9, exp9)
})

test.only('vec3: cross() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const ret1 = cross(obs1, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(0, 0, 0)
  t.deepEqual(obs1, exp1)
  t.deepEqual(ret1, exp1)

  let obs2 = fromValues(0, 0, 0)
  const ret2 = cross(obs2, [5, 5, 5], [10, 20, 30])
  const exp2 = fromValues(50.000000000, -100.000000000, 50.000000000)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = cross(obs3, [5, 5, 5], [10, -20, 30])
  const exp3 = fromValues(250.000000000, -100.000000000, -150.000000000)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = cross(obs4, [5, 5, 5], [-10, -20, 30])
  const exp4 = fromValues(250.000000000, -200.000000000, -50.000000000)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)

  let obs5 = fromValues(0, 0, 0)
  const ret5 = cross(obs5, [5, 5, 5], [-10, 20, 30])
  const exp5 = fromValues(50.000000000, -200.000000000, 150.0000000000)
  t.deepEqual(obs5, exp5)
  t.deepEqual(ret5, exp5)

  let obs6 = fromValues(0, 0, 0)
  const ret6 = cross(obs6, [5, 5, 5], [10, 20, -30])
  const exp6 = fromValues(-250.000000000, 200.000000000, 50.000000000)
  t.deepEqual(obs6, exp6)
  t.deepEqual(ret6, exp6)

  let obs7 = fromValues(0, 0, 0)
  const ret7 = cross(obs7, [5, 5, 5], [10, -20, -30])
  const exp7 = fromValues(-50.000000000, 200.000000000, -150.000000000)
  t.deepEqual(obs7, exp7)
  t.deepEqual(ret7, exp7)

  let obs8 = fromValues(0, 0, 0)
  const ret8 = cross(obs8, [5, 5, 5], [-10, -20, -30])
  const exp8 = fromValues(-50.000000000, 100.000000000, -50.000000000)
  t.deepEqual(obs8, exp8)
  t.deepEqual(ret8, exp8)

  let obs9 = fromValues(0, 0, 0)
  const ret9 = cross(obs9, [5, 5, 5], [-10, 20, -30])
  const exp9 = fromValues(-250.000000000, 100.000000000, 150.0000000000)
  t.deepEqual(obs9, exp9)
  t.deepEqual(ret9, exp9)
})
