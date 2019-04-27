const test = require('ava')

const {ellipse} = require('./index')

const geom2 = require('../geometry/geom2')

const comparePoints = require('../../test/helpers/comparePoints')

test('ellipse (defaults)', t => {
  const exp = [
    [ 0, 1 ],
    [ -0.3420201539993286, 0.9396926164627075 ],
    [ -0.6427876353263855, 0.7660444378852844 ],
    [ -0.8660253882408142, 0.5 ],
    [ -0.9848077297210693, 0.1736481785774231 ],
    [ -0.9848077297210693, -0.1736481785774231 ],
    [ -0.8660253882408142, -0.5 ],
    [ -0.6427876353263855, -0.7660444378852844 ],
    [ -0.3420201539993286, -0.9396926164627075 ],
    [ -1.8369701465288538e-16, -1 ],
    [ 0.3420201539993286, -0.9396926164627075 ],
    [ 0.6427876353263855, -0.7660444378852844 ],
    [ 0.8660253882408142, -0.5 ],
    [ 0.9848077297210693, -0.1736481785774231 ],
    [ 0.9848077297210693, 0.1736481785774231 ],
    [ 0.8660253882408142, 0.5 ],
    [ 0.6427876353263855, 0.7660444378852844 ],
    [ 0.3420201539993286, 0.9396926164627075 ]
  ]
  const geometry = ellipse()
  const obs = geom2.toPoints(geometry)

  t.deepEqual(obs.length, 18)
  t.true(comparePoints(obs, exp))
})