import test from 'ava';
import {CSG} from '../csg';
import {CAG} from '../csg';
import {OBJ} from '../helpers/obj-store';

//
// Test suite for CSG Common Shapes
//

test("CSG should produce proper spheres", t => {
  var s1 = CSG.sphere(); // center:[0,0],radius:1,resolution:defaultResolution2D

// verify that object structures do not change
  t.deepEqual(s1,OBJ.loadPrevious('csg.s1',s1));
});

test("CSG should produce proper cylinders", t => {
  var c1 = CSG.cylinder(); // start:[0,-1,0],end:[0,1,0],radius:1,sectorAngle:360
});

test("CSG should produce proper rounded cylinders", t => {
  var rc1 = CSG.roundedCylinder(); // start:[0,-1,0],end:[0,1,0],radius:1
});

test("CSG should produce proper cubes", t => {
  var c1 = CSG.cube();
});

test("CSG should produce proper rounded cube", t => {
  var rc1 = CSG.roundedCube();
});

test("CSG should produce proper polyhedrons", t => {
  //var p1 = CSG.polyhedron();
});

