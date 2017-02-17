import test from 'ava';
import {CSG} from '../csg';
import comparePolygons from "../helpers/comparePolygons";

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

function createOperands(){
    const a = CSG.cube({
        center: [0,0,0],
        radius: [1,1,1]
    });
    const b = CSG.cube({
        center: [2,0,0],
        radius: [1,1,1]
    });
    const c = CSG.cube({
        center: [1,0,0],
        radius: [2,1,1]
    });
    return {a, b, c};
}

// Constructive operations
test('CSG.union', t => {
    const {a, b, c} = createOperands();
    sameCSG(a.union(b), c) ? t.pass() : t.fail();
});
test('CSG.intersect', t => {
    const {a, b, c} = createOperands();
    sameCSG(c.intersect(b), b) ? t.pass() : t.fail();
});
test('CSG.subtract', t => {
    const {a, b, c} = createOperands();
    sameCSG(c.subtract(a), b) ? t.pass() : t.fail();
});

// geometry

// CSG cube
// CSG sphere
// CSG cylinder
// CSG roundedCylinder
// CSG roundedCube
// CSG polyhedron
