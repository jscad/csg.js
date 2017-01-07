import test from 'ava';
import {CSG} from './csg';

// Compare two polygons together.
// They are identical if they are composed with the same vertices in the same
// relative order
// todo: could be part of csg.js
// todo: should simplify colinear vertices
// @return true if both polygons are identical
function comparePolygons(a, b){
    // First find one matching vertice
    // We try to find the first vertice of a inside b
    // If there is no such vertice, then a != b
    if (a.vertices.length !== b.vertices.length || a.vertices.length === 0) {
        return false;
    }
    let start = a.vertices[0];
    let index = b.vertices.findIndex(v => {
        return v._x === start._x && v._y === start._y && v._z === start._z;
    });
    if (index === -1) {
        return false;
    }
    // Rearrange b vertices so that they start with the same vertex as a
    let vs = b.vertices;
    if (index !== 0) {
        vs = b.vertices.slice(index).concat(b.vertices.slice(0, index));
    }
    // Compare now vertices one by one
    for (let i =0; i < a.vertices.length; i++) {
        if (a.vertices[i]._x !== vs[i]._x ||
            a.vertices[i]._y !== vs[i]._y ||
            a.vertices[i]._z !== vs[i]._z){return false;}
    }
    return true;
}

function sameCSG(a, b){
    return containsCSG(a, b) && containsCSG(b, a);
}

// a contains b if b polygons are also found in a
function containsCSG(a, b){
    return a.toPolygons().map(p => {
        let found = false;
        let bp = b.toPolygons();
        for (let i=0; i<bp.length;i++) {
            if (comparePolygons(p, bp[i])) {
                found = true;
                break;
            }
        }
        return found;
    }).reduce((a,b) => a && b);
};

// bit of testing on comparePolygons function
test('comparePolygons on same single vertex', t => {
    let a = {vertices:[{_x:0,_y:0,_z:0}]};
    t.true(comparePolygons(a, a));
});

test('comparePolygons on different vertices', t => {
    let a = {vertices:[{_x:0,_y:0,_z:0}]}, b = {vertices:[{_x:1,_y:1,_z:1}]};
    t.false(comparePolygons(a, b));
});

test('comparePolygons on same polygon', t => {
    let a = {vertices:[
        {_x:0,_y:0,_z:0},
        {_x:1,_y:1,_z:1},
        {_x:-1,_y:1,_z:1}
    ]};
    t.true(comparePolygons(a, a));
});

test('comparePolygons on same polygon with different vertice order', t => {
    let a = {vertices:[
            {_x:0,_y:0,_z:0},
            {_x:1,_y:1,_z:1},
            {_x:-1,_y:1,_z:1}
        ]},
        b = {vertices:[
            {_x:-1,_y:1,_z:1},
            {_x:0,_y:0,_z:0},
            {_x:1,_y:1,_z:1}
        ]};
    t.true(comparePolygons(a, b));
});

test('comparePolygons on different polygon with same vertice', t => {
    let a = {vertices:[
            {_x:0,_y:0,_z:0},
            {_x:1,_y:1,_z:1},
            {_x:-1,_y:1,_z:1}
        ]},
        b = {vertices:[
            {_x:0,_y:0,_z:0},
            {_x:-1,_y:1,_z:1},
            {_x:1,_y:1,_z:1}
        ]};
    t.false(comparePolygons(a, b));
});

// Constructive operations
// a + b = c
let a = CSG.cube({
    center: [0,0,0],
    radius: [1,1,1]
});
let b = CSG.cube({
    center: [2,0,0],
    radius: [1,1,1]
});
let c = CSG.cube({
    center: [1,0,0],
    radius: [2,1,1]
});

test('CSG.union', t => {
    sameCSG(a.union(b), c) ? t.pass() : t.fail();
});
test('CSG.intersect', t => {
    sameCSG(c.intersect(b), b) ? t.pass() : t.fail();
});
test('CSG.subtract', t => {
    sameCSG(c.subtract(a), b) ? t.pass() : t.fail();
});

// geometry

// CSG cube
// CSG sphere
// CSG cylinder
// CSG roundedCylinder
// CSG roundedCube
// CSG polyhedron
