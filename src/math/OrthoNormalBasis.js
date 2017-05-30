// # class OrthoNormalBasis
// Reprojects points on a 3D plane onto a 2D plane
// or from a 2D plane back onto the 3D plane
CSG.OrthoNormalBasis = function(plane, rightvector) {
    if (arguments.length < 2) {
        // choose an arbitrary right hand vector, making sure it is somewhat orthogonal to the plane normal:
        rightvector = plane.normal.randomNonParallelVector();
    } else {
        rightvector = new CSG.Vector3D(rightvector);
    }
    this.v = plane.normal.cross(rightvector).unit();
    this.u = this.v.cross(plane.normal);
    this.plane = plane;
    this.planeorigin = plane.normal.times(plane.w);
};

// Get an orthonormal basis for the standard XYZ planes.
// Parameters: the names of two 3D axes. The 2d x axis will map to the first given 3D axis, the 2d y
// axis will map to the second.
// Prepend the axis with a "-" to invert the direction of this axis.
// For example: CSG.OrthoNormalBasis.GetCartesian("-Y","Z")
//   will return an orthonormal basis where the 2d X axis maps to the 3D inverted Y axis, and
//   the 2d Y axis maps to the 3D Z axis.
CSG.OrthoNormalBasis.GetCartesian = function(xaxisid, yaxisid) {
    var axisid = xaxisid + "/" + yaxisid;
    var planenormal, rightvector;
    if (axisid == "X/Y") {
        planenormal = [0, 0, 1];
        rightvector = [1, 0, 0];
    } else if (axisid == "Y/-X") {
        planenormal = [0, 0, 1];
        rightvector = [0, 1, 0];
    } else if (axisid == "-X/-Y") {
        planenormal = [0, 0, 1];
        rightvector = [-1, 0, 0];
    } else if (axisid == "-Y/X") {
        planenormal = [0, 0, 1];
        rightvector = [0, -1, 0];
    } else if (axisid == "-X/Y") {
        planenormal = [0, 0, -1];
        rightvector = [-1, 0, 0];
    } else if (axisid == "-Y/-X") {
        planenormal = [0, 0, -1];
        rightvector = [0, -1, 0];
    } else if (axisid == "X/-Y") {
        planenormal = [0, 0, -1];
        rightvector = [1, 0, 0];
    } else if (axisid == "Y/X") {
        planenormal = [0, 0, -1];
        rightvector = [0, 1, 0];
    } else if (axisid == "X/Z") {
        planenormal = [0, -1, 0];
        rightvector = [1, 0, 0];
    } else if (axisid == "Z/-X") {
        planenormal = [0, -1, 0];
        rightvector = [0, 0, 1];
    } else if (axisid == "-X/-Z") {
        planenormal = [0, -1, 0];
        rightvector = [-1, 0, 0];
    } else if (axisid == "-Z/X") {
        planenormal = [0, -1, 0];
        rightvector = [0, 0, -1];
    } else if (axisid == "-X/Z") {
        planenormal = [0, 1, 0];
        rightvector = [-1, 0, 0];
    } else if (axisid == "-Z/-X") {
        planenormal = [0, 1, 0];
        rightvector = [0, 0, -1];
    } else if (axisid == "X/-Z") {
        planenormal = [0, 1, 0];
        rightvector = [1, 0, 0];
    } else if (axisid == "Z/X") {
        planenormal = [0, 1, 0];
        rightvector = [0, 0, 1];
    } else if (axisid == "Y/Z") {
        planenormal = [1, 0, 0];
        rightvector = [0, 1, 0];
    } else if (axisid == "Z/-Y") {
        planenormal = [1, 0, 0];
        rightvector = [0, 0, 1];
    } else if (axisid == "-Y/-Z") {
        planenormal = [1, 0, 0];
        rightvector = [0, -1, 0];
    } else if (axisid == "-Z/Y") {
        planenormal = [1, 0, 0];
        rightvector = [0, 0, -1];
    } else if (axisid == "-Y/Z") {
        planenormal = [-1, 0, 0];
        rightvector = [0, -1, 0];
    } else if (axisid == "-Z/-Y") {
        planenormal = [-1, 0, 0];
        rightvector = [0, 0, -1];
    } else if (axisid == "Y/-Z") {
        planenormal = [-1, 0, 0];
        rightvector = [0, 1, 0];
    } else if (axisid == "Z/Y") {
        planenormal = [-1, 0, 0];
        rightvector = [0, 0, 1];
    } else {
        throw new Error("CSG.OrthoNormalBasis.GetCartesian: invalid combination of axis identifiers. Should pass two string arguments from [X,Y,Z,-X,-Y,-Z], being two different axes.");
    }
    return new CSG.OrthoNormalBasis(new CSG.Plane(new CSG.Vector3D(planenormal), 0), new CSG.Vector3D(rightvector));
};

/*
// test code for CSG.OrthoNormalBasis.GetCartesian()
CSG.OrthoNormalBasis.GetCartesian_Test=function() {
  var axisnames=["X","Y","Z","-X","-Y","-Z"];
  var axisvectors=[[1,0,0], [0,1,0], [0,0,1], [-1,0,0], [0,-1,0], [0,0,-1]];
  for(var axis1=0; axis1 < 3; axis1++) {
    for(var axis1inverted=0; axis1inverted < 2; axis1inverted++) {
      var axis1name=axisnames[axis1+3*axis1inverted];
      var axis1vector=axisvectors[axis1+3*axis1inverted];
      for(var axis2=0; axis2 < 3; axis2++) {
        if(axis2 != axis1) {
          for(var axis2inverted=0; axis2inverted < 2; axis2inverted++) {
            var axis2name=axisnames[axis2+3*axis2inverted];
            var axis2vector=axisvectors[axis2+3*axis2inverted];
            var orthobasis=CSG.OrthoNormalBasis.GetCartesian(axis1name, axis2name);
            var test1=orthobasis.to3D(new CSG.Vector2D([1,0]));
            var test2=orthobasis.to3D(new CSG.Vector2D([0,1]));
            var expected1=new CSG.Vector3D(axis1vector);
            var expected2=new CSG.Vector3D(axis2vector);
            var d1=test1.distanceTo(expected1);
            var d2=test2.distanceTo(expected2);
            if( (d1 > 0.01) || (d2 > 0.01) ) {
              throw new Error("Wrong!");
  }}}}}}
  throw new Error("OK");
};
*/

// The z=0 plane, with the 3D x and y vectors mapped to the 2D x and y vector
CSG.OrthoNormalBasis.Z0Plane = function() {
    var plane = new CSG.Plane(new CSG.Vector3D([0, 0, 1]), 0);
    return new CSG.OrthoNormalBasis(plane, new CSG.Vector3D([1, 0, 0]));
};

CSG.OrthoNormalBasis.prototype = {
    getProjectionMatrix: function() {
        return new CSG.Matrix4x4([
            this.u.x, this.v.x, this.plane.normal.x, 0,
            this.u.y, this.v.y, this.plane.normal.y, 0,
            this.u.z, this.v.z, this.plane.normal.z, 0,
            0, 0, -this.plane.w, 1
        ]);
    },

    getInverseProjectionMatrix: function() {
        var p = this.plane.normal.times(this.plane.w);
        return new CSG.Matrix4x4([
            this.u.x, this.u.y, this.u.z, 0,
            this.v.x, this.v.y, this.v.z, 0,
            this.plane.normal.x, this.plane.normal.y, this.plane.normal.z, 0,
            p.x, p.y, p.z, 1
        ]);
    },

    to2D: function(vec3) {
        return new CSG.Vector2D(vec3.dot(this.u), vec3.dot(this.v));
    },

    to3D: function(vec2) {
        return this.planeorigin.plus(this.u.times(vec2.x)).plus(this.v.times(vec2.y));
    },

    line3Dto2D: function(line3d) {
        var a = line3d.point;
        var b = line3d.direction.plus(a);
        var a2d = this.to2D(a);
        var b2d = this.to2D(b);
        return CSG.Line2D.fromPoints(a2d, b2d);
    },

    line2Dto3D: function(line2d) {
        var a = line2d.origin();
        var b = line2d.direction().plus(a);
        var a3d = this.to3D(a);
        var b3d = this.to3D(b);
        return CSG.Line3D.fromPoints(a3d, b3d);
    },

    transform: function(matrix4x4) {
        // todo: this may not work properly in case of mirroring
        var newplane = this.plane.transform(matrix4x4);
        var rightpoint_transformed = this.u.transform(matrix4x4);
        var origin_transformed = new CSG.Vector3D(0, 0, 0).transform(matrix4x4);
        var newrighthandvector = rightpoint_transformed.minus(origin_transformed);
        var newbasis = new CSG.OrthoNormalBasis(newplane, newrighthandvector);
        return newbasis;
    }
};
