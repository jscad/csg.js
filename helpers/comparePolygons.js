// Compare two polygons together.
// They are identical if they are composed with the same vertices in the same
// relative order
// todo: could be part of csg.js
// todo: should simplify colinear vertices
// @return true if both polygons are identical
module.exports = function comparePolygons(a, b){
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