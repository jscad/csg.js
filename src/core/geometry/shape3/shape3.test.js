const test = require('ava')
const create = require('./create')

test('New shape3 should contain nothing', t => {
  const shape3 = create()
  console.log('shape3', shape3)

})
