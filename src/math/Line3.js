// # class Line3D
// Represents a line in 3D space
// direction must be a unit vector
// point is a random point on the line
CSG.Line3D = function(point, direction) {
    point = new CSG.Vector3D(point);
    direction = new CSG.Vector3D(direction);
    this.point = point;
    this.direction = direction.unit();
};

CSG.Line3D.fromPoints = function(p1, p2) {
    p1 = new CSG.Vector3D(p1);
    p2 = new CSG.Vector3D(p2);
    var direction = p2.minus(p1);
    return new CSG.Line3D(p1, direction);
};

CSG.Line3D.fromPlanes = function(p1, p2) {
    var direction = p1.normal.cross(p2.normal);
    var l = direction.length();
    if (l < CSG.EPS) {
        throw new Error("Parallel planes");
    }
    direction = direction.times(1.0 / l);

    var mabsx = Math.abs(direction.x);
    var mabsy = Math.abs(direction.y);
    var mabsz = Math.abs(direction.z);
    var origin;
    if ((mabsx >= mabsy) && (mabsx >= mabsz)) {
        // direction vector is mostly pointing towards x
        // find a point p for which x is zero:
        var r = CSG.solve2Linear(p1.normal.y, p1.normal.z, p2.normal.y, p2.normal.z, p1.w, p2.w);
        origin = new CSG.Vector3D(0, r[0], r[1]);
    } else if ((mabsy >= mabsx) && (mabsy >= mabsz)) {
        // find a point p for which y is zero:
        var r = CSG.solve2Linear(p1.normal.x, p1.normal.z, p2.normal.x, p2.normal.z, p1.w, p2.w);
        origin = new CSG.Vector3D(r[0], 0, r[1]);
    } else {
        // find a point p for which z is zero:
        var r = CSG.solve2Linear(p1.normal.x, p1.normal.y, p2.normal.x, p2.normal.y, p1.w, p2.w);
        origin = new CSG.Vector3D(r[0], r[1], 0);
    }
    return new CSG.Line3D(origin, direction);
};


CSG.Line3D.prototype = {
    intersectWithPlane: function(plane) {
        // plane: plane.normal * p = plane.w
        // line: p=line.point + labda * line.direction
        var labda = (plane.w - plane.normal.dot(this.point)) / plane.normal.dot(this.direction);
        var point = this.point.plus(this.direction.times(labda));
        return point;
    },

    clone: function(line) {
        return new CSG.Line3D(this.point.clone(), this.direction.clone());
    },

    reverse: function() {
        return new CSG.Line3D(this.point.clone(), this.direction.negated());
    },

    transform: function(matrix4x4) {
        var newpoint = this.point.multiply4x4(matrix4x4);
        var pointPlusDirection = this.point.plus(this.direction);
        var newPointPlusDirection = pointPlusDirection.multiply4x4(matrix4x4);
        var newdirection = newPointPlusDirection.minus(newpoint);
        return new CSG.Line3D(newpoint, newdirection);
    },

    closestPointOnLine: function(point) {
        point = new CSG.Vector3D(point);
        var t = point.minus(this.point).dot(this.direction) / this.direction.dot(this.direction);
        var closestpoint = this.point.plus(this.direction.times(t));
        return closestpoint;
    },

    distanceToPoint: function(point) {
        point = new CSG.Vector3D(point);
        var closestpoint = this.closestPointOnLine(point);
        var distancevector = point.minus(closestpoint);
        var distance = distancevector.length();
        return distance;
    },

    equals: function(line3d) {
        if (!this.direction.equals(line3d.direction)) return false;
        var distance = this.distanceToPoint(line3d.point);
        if (distance > CSG.EPS) return false;
        return true;
    }
};
