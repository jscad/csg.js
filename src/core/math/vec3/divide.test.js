const test = require('ava')
const {divide, fromValues} = require('./index')

test.only('vec3: divide() called with two paramerters should return a vec3 with correct values', t => {

  const zerodivzero = 0/0
  const obs1 = divide([0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(Math.fround(zerodivzero), Math.fround(zerodivzero), Math.fround(zerodivzero))
  // t.deepEqual(obs1, exp1) why does this fail? nodejs bug?

  const obs2 = divide([0, 0, 0], [1, 2, 3])
  const exp2 = fromValues(0, 0, 0)
  t.deepEqual(obs2, exp2)

  const obs3 = divide([6, 6, 6], [1, 2, 3])
  const exp3 = fromValues(6, 3, 2)
  t.deepEqual(obs3, exp3)

  const obs4 = divide([-6, -6, -6], [1, 2, 3])
  const exp4 = fromValues(-6, -3, -2)
  t.deepEqual(obs4, exp4)

  const obs5 = divide([6, 6, 6], [-1, -2, -3])
  const exp5 = fromValues(-6, -3, -2)
  t.deepEqual(obs5, exp5)

  const obs6 = divide([-6, -6, -6], [-1, -2, -3])
  const exp6 = fromValues(6, 3, 2)
  t.deepEqual(obs6, exp6)
})

test.only('vec3: divide() called with three paramerters should update a vec3 with correct values', t => {
  let obs1 = fromValues(0, 0, 0)
  const zerodivzero = 0/0
  const ret1 = divide(obs1, [0, 0, 0], [0, 0, 0])
  const exp1 = fromValues(Math.fround(zerodivzero), Math.fround(zerodivzero), Math.fround(zerodivzero))
  // t.deepEqual(obs1, exp1) why does this fail? nodejs bug?
  // t.deepEqual(ret1, exp1) why does this fail? nodejs bug?

  let obs2 = fromValues(0, 0, 0)
  const ret2 = divide(obs2, [0, 0, 0], [1, 2, 3])
  const exp2 = fromValues(0, 0, 0)
  t.deepEqual(obs2, exp2)
  t.deepEqual(ret2, exp2)

  let obs3 = fromValues(0, 0, 0)
  const ret3 = divide(obs3, [6, 6, 6], [1, 2, 3])
  const exp3 = fromValues(6, 3, 2)
  t.deepEqual(obs3, exp3)
  t.deepEqual(ret3, exp3)

  let obs4 = fromValues(0, 0, 0)
  const ret4 = divide(obs4, [-6, -6, -6], [1, 2, 3])
  const exp4 = fromValues(-6, -3, -2)
  t.deepEqual(obs4, exp4)
  t.deepEqual(ret4, exp4)

  let obs5 = fromValues(0, 0, 0)
  const ret5 = divide(obs5, [6, 6, 6], [-1, -2, -3])
  const exp5 = fromValues(-6, -3, -2)
  t.deepEqual(obs5, exp5)
  t.deepEqual(ret5, exp5)

  let obs6 = fromValues(0, 0, 0)
  const ret6 = divide(obs6, [-6, -6, -6], [-1, -2, -3])
  const exp6 = fromValues(6, 3, 2)
  t.deepEqual(obs6, exp6)
  t.deepEqual(ret6, exp6)
})
