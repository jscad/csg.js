// # class Line2D
// Represents a directional line in 2D space
// A line is parametrized by its normal vector (perpendicular to the line, rotated 90 degrees counter clockwise)
// and w. The line passes through the point <normal>.times(w).
// normal must be a unit vector!
// Equation: p is on line if normal.dot(p)==w
CSG.Line2D = function(normal, w) {
    normal = new CSG.Vector2D(normal);
    w = parseFloat(w);
    var l = normal.length();
    // normalize:
    w *= l;
    normal = normal.times(1.0 / l);
    this.normal = normal;
    this.w = w;
};

CSG.Line2D.fromPoints = function(p1, p2) {
    p1 = new CSG.Vector2D(p1);
    p2 = new CSG.Vector2D(p2);
    var direction = p2.minus(p1);
    var normal = direction.normal().negated().unit();
    var w = p1.dot(normal);
    return new CSG.Line2D(normal, w);
};

CSG.Line2D.prototype = {
    // same line but opposite direction:
    reverse: function() {
        return new CSG.Line2D(this.normal.negated(), -this.w);
    },

    equals: function(l) {
        return (l.normal.equals(this.normal) && (l.w == this.w));
    },

    origin: function() {
        return this.normal.times(this.w);
    },

    direction: function() {
        return this.normal.normal();
    },

    xAtY: function(y) {
        // (py == y) && (normal * p == w)
        // -> px = (w - normal._y * y) / normal.x
        var x = (this.w - this.normal._y * y) / this.normal.x;
        return x;
    },

    absDistanceToPoint: function(point) {
        point = new CSG.Vector2D(point);
        var point_projected = point.dot(this.normal);
        var distance = Math.abs(point_projected - this.w);
        return distance;
    },
    /*FIXME: has error - origin is not defined, the method is never used
     closestPoint: function(point) {
         point = new CSG.Vector2D(point);
         var vector = point.dot(this.direction());
         return origin.plus(vector);
     },
     */

    // intersection between two lines, returns point as Vector2D
    intersectWithLine: function(line2d) {
        var point = CSG.solve2Linear(this.normal.x, this.normal.y, line2d.normal.x, line2d.normal.y, this.w, line2d.w);
        point = new CSG.Vector2D(point); // make  vector2d
        return point;
    },

    transform: function(matrix4x4) {
        var origin = new CSG.Vector2D(0, 0);
        var pointOnPlane = this.normal.times(this.w);
        var neworigin = origin.multiply4x4(matrix4x4);
        var neworiginPlusNormal = this.normal.multiply4x4(matrix4x4);
        var newnormal = neworiginPlusNormal.minus(neworigin);
        var newpointOnPlane = pointOnPlane.multiply4x4(matrix4x4);
        var neww = newnormal.dot(newpointOnPlane);
        return new CSG.Line2D(newnormal, neww);
    }
};
