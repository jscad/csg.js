import test from 'ava'
import {CSG} from '../csg'

test('CSG.connectorslist can be created', t => {
  const observed = new CSG.ConnectorList()

  t.deepEqual(observed, {connectors_: []})
})
