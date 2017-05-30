/** Construct an axis-aligned solid cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of cube, single scalar also possible
 * @returns {CSG} new 3D solid
 *
 * @example
 * var cube = CSG.cube({
 *   center: [5, 5, 5],
 *   radius: 5, // scalar radius
 * });
 */
CSG.cube = function(options) {
    var c, r, corner1, corner2;
    options = options || {};
    if (('corner1' in options) || ('corner2' in options)) {
        if (('center' in options) || ('radius' in options)) {
            throw new Error("cube: should either give a radius and center parameter, or a corner1 and corner2 parameter")
        }
        var corner1 = CSG.parseOptionAs3DVector(options, "corner1", [0, 0, 0]);
        var corner2 = CSG.parseOptionAs3DVector(options, "corner2", [1, 1, 1]);
        c = corner1.plus(corner2).times(0.5);
        r = corner2.minus(corner1).times(0.5);
    } else {
        c = CSG.parseOptionAs3DVector(options, "center", [0, 0, 0]);
        r = CSG.parseOptionAs3DVector(options, "radius", [1, 1, 1]);
    }
    r = r.abs(); // negative radii make no sense
    var result = CSG.fromPolygons([
        [
            [0, 4, 6, 2],
            [-1, 0, 0]
        ],
        [
            [1, 3, 7, 5],
            [+1, 0, 0]
        ],
        [
            [0, 1, 5, 4],
            [0, -1, 0]
        ],
        [
            [2, 6, 7, 3],
            [0, +1, 0]
        ],
        [
            [0, 2, 3, 1],
            [0, 0, -1]
        ],
        [
            [4, 5, 7, 6],
            [0, 0, +1]
        ]
    ].map(function(info) {
        //var normal = new CSG.Vector3D(info[1]);
        //var plane = new CSG.Plane(normal, 1);
        var vertices = info[0].map(function(i) {
            var pos = new CSG.Vector3D(
                c.x + r.x * (2 * !!(i & 1) - 1), c.y + r.y * (2 * !!(i & 2) - 1), c.z + r.z * (2 * !!(i & 4) - 1));
            return new CSG.Vertex(pos);
        });
        return new CSG.Polygon(vertices, null /* , plane */ );
    }));
    result.properties.cube = new CSG.Properties();
    result.properties.cube.center = new CSG.Vector3D(c);
    // add 6 connectors, at the centers of each face:
    result.properties.cube.facecenters = [
        new CSG.Connector(new CSG.Vector3D([r.x, 0, 0]).plus(c), [1, 0, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([-r.x, 0, 0]).plus(c), [-1, 0, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, r.y, 0]).plus(c), [0, 1, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, -r.y, 0]).plus(c), [0, -1, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, 0, r.z]).plus(c), [0, 0, 1], [1, 0, 0]),
        new CSG.Connector(new CSG.Vector3D([0, 0, -r.z]).plus(c), [0, 0, -1], [1, 0, 0])
    ];
    return result;
};

/** Construct a solid sphere
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of sphere
 * @param {Number} [options.radius=1] - radius of sphere
 * @param {Number} [options.resolution=CSG.defaultResolution3D] - number of polygons per 360 degree revolution
 * @param {Array} [options.axes] -  an array with 3 vectors for the x, y and z base vectors
 * @returns {CSG} new 3D solid
 *
 *
 * @example
 * var sphere = CSG.sphere({
 *   center: [0, 0, 0],
 *   radius: 2,
 *   resolution: 32,
 * });
*/
CSG.sphere = function(options) {
    options = options || {};
    var center = CSG.parseOptionAs3DVector(options, "center", [0, 0, 0]);
    var radius = CSG.parseOptionAsFloat(options, "radius", 1);
    var resolution = CSG.parseOptionAsInt(options, "resolution", CSG.defaultResolution3D);
    var xvector, yvector, zvector;
    if ('axes' in options) {
        xvector = options.axes[0].unit().times(radius);
        yvector = options.axes[1].unit().times(radius);
        zvector = options.axes[2].unit().times(radius);
    } else {
        xvector = new CSG.Vector3D([1, 0, 0]).times(radius);
        yvector = new CSG.Vector3D([0, -1, 0]).times(radius);
        zvector = new CSG.Vector3D([0, 0, 1]).times(radius);
    }
    if (resolution < 4) resolution = 4;
    var qresolution = Math.round(resolution / 4);
    var prevcylinderpoint;
    var polygons = [];
    for (var slice1 = 0; slice1 <= resolution; slice1++) {
        var angle = Math.PI * 2.0 * slice1 / resolution;
        var cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)));
        if (slice1 > 0) {
            // cylinder vertices:
            var vertices = [];
            var prevcospitch, prevsinpitch;
            for (var slice2 = 0; slice2 <= qresolution; slice2++) {
                var pitch = 0.5 * Math.PI * slice2 / qresolution;
                var cospitch = Math.cos(pitch);
                var sinpitch = Math.sin(pitch);
                if (slice2 > 0) {
                    vertices = [];
                    vertices.push(new CSG.Vertex(center.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                    vertices.push(new CSG.Vertex(center.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                    if (slice2 < qresolution) {
                        vertices.push(new CSG.Vertex(center.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                    }
                    vertices.push(new CSG.Vertex(center.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                    polygons.push(new CSG.Polygon(vertices));
                    vertices = [];
                    vertices.push(new CSG.Vertex(center.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                    vertices.push(new CSG.Vertex(center.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                    if (slice2 < qresolution) {
                        vertices.push(new CSG.Vertex(center.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                    }
                    vertices.push(new CSG.Vertex(center.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                    vertices.reverse();
                    polygons.push(new CSG.Polygon(vertices));
                }
                prevcospitch = cospitch;
                prevsinpitch = sinpitch;
            }
        }
        prevcylinderpoint = cylinderpoint;
    }
    var result = CSG.fromPolygons(polygons);
    result.properties.sphere = new CSG.Properties();
    result.properties.sphere.center = new CSG.Vector3D(center);
    result.properties.sphere.facepoint = center.plus(xvector);
    return result;
};

/** Construct a solid cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of cylinder, must be scalar
 * @param {Number} [options.resolution=CSG.defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * var cylinder = CSG.cylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 10,
 *   resolution: 16
 * });
 */
CSG.cylinder = function(options) {
    var s = CSG.parseOptionAs3DVector(options, "start", [0, -1, 0]);
    var e = CSG.parseOptionAs3DVector(options, "end", [0, 1, 0]);
    var r = CSG.parseOptionAsFloat(options, "radius", 1);
    var rEnd = CSG.parseOptionAsFloat(options, "radiusEnd", r);
    var rStart = CSG.parseOptionAsFloat(options, "radiusStart", r);
    var alpha = CSG.parseOptionAsFloat(options, "sectorAngle", 360);
    alpha = alpha > 360 ? alpha % 360 : alpha;

    if ((rEnd < 0) || (rStart < 0)) {
        throw new Error("Radius should be non-negative");
    }
    if ((rEnd === 0) && (rStart === 0)) {
        throw new Error("Either radiusStart or radiusEnd should be positive");
    }

    var slices = CSG.parseOptionAsInt(options, "resolution", CSG.defaultResolution2D); // FIXME is this 3D?
    var ray = e.minus(s);
    var axisZ = ray.unit(); //, isY = (Math.abs(axisZ.y) > 0.5);
    var axisX = axisZ.randomNonParallelVector().unit();

    //  var axisX = new CSG.Vector3D(isY, !isY, 0).cross(axisZ).unit();
    var axisY = axisX.cross(axisZ).unit();
    var start = new CSG.Vertex(s);
    var end = new CSG.Vertex(e);
    var polygons = [];

    function point(stack, slice, radius) {
        var angle = slice * Math.PI * alpha / 180;
        var out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
        var pos = s.plus(ray.times(stack)).plus(out.times(radius));
        return new CSG.Vertex(pos);
    }
    if (alpha > 0) {
        for (var i = 0; i < slices; i++) {
            var t0 = i / slices,
                t1 = (i + 1) / slices;
            if (rEnd == rStart) {
                polygons.push(new CSG.Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]));
                polygons.push(new CSG.Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]));
                polygons.push(new CSG.Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
            } else {
                if (rStart > 0) {
                    polygons.push(new CSG.Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]));
                    polygons.push(new CSG.Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]));
                }
                if (rEnd > 0) {
                    polygons.push(new CSG.Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
                    polygons.push(new CSG.Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]));
                }
            }
        }
        if (alpha < 360) {
            polygons.push(new CSG.Polygon([start, end, point(0, 0, rStart)]));
            polygons.push(new CSG.Polygon([point(0, 0, rStart), end, point(1, 0, rEnd)]));
            polygons.push(new CSG.Polygon([start, point(0, 1, rStart), end]));
            polygons.push(new CSG.Polygon([point(0, 1, rStart), point(1, 1, rEnd), end]));
        }
    }
    var result = CSG.fromPolygons(polygons);
    result.properties.cylinder = new CSG.Properties();
    result.properties.cylinder.start = new CSG.Connector(s, axisZ.negated(), axisX);
    result.properties.cylinder.end = new CSG.Connector(e, axisZ, axisX);
    var cylCenter = s.plus(ray.times(0.5));
    var fptVec = axisX.rotate(s, axisZ, -alpha / 2).times((rStart + rEnd) / 2);
    var fptVec90 = fptVec.cross(axisZ);
    // note this one is NOT a face normal for a cone. - It's horizontal from cyl perspective
    result.properties.cylinder.facepointH = new CSG.Connector(cylCenter.plus(fptVec), fptVec, axisZ);
    result.properties.cylinder.facepointH90 = new CSG.Connector(cylCenter.plus(fptVec90), fptVec90, axisZ);
    return result;
};

/** Construct a cylinder with rounded ends.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Number} [options.radius=1] - radius of rounded ends, must be scalar
 * @param {Vector3D} [options.normal] - vector determining the starting angle for tesselation. Should be non-parallel to start.minus(end)
 * @param {Number} [options.resolution=CSG.defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * var cylinder = CSG.roundedCylinder({
 *   start: [0, -10, 0],
 *   end: [0, 10, 0],
 *   radius: 2,
 *   resolution: 16
 * });
 */
CSG.roundedCylinder = function(options) {
    var p1 = CSG.parseOptionAs3DVector(options, "start", [0, -1, 0]);
    var p2 = CSG.parseOptionAs3DVector(options, "end", [0, 1, 0]);
    var radius = CSG.parseOptionAsFloat(options, "radius", 1);
    var direction = p2.minus(p1);
    var defaultnormal;
    if (Math.abs(direction.x) > Math.abs(direction.y)) {
        defaultnormal = new CSG.Vector3D(0, 1, 0);
    } else {
        defaultnormal = new CSG.Vector3D(1, 0, 0);
    }
    var normal = CSG.parseOptionAs3DVector(options, "normal", defaultnormal);
    var resolution = CSG.parseOptionAsInt(options, "resolution", CSG.defaultResolution3D);
    if (resolution < 4) resolution = 4;
    var polygons = [];
    var qresolution = Math.floor(0.25 * resolution);
    var length = direction.length();
    if (length < CSG.EPS) {
        return CSG.sphere({
            center: p1,
            radius: radius,
            resolution: resolution
        });
    }
    var zvector = direction.unit().times(radius);
    var xvector = zvector.cross(normal).unit().times(radius);
    var yvector = xvector.cross(zvector).unit().times(radius);
    var prevcylinderpoint;
    for (var slice1 = 0; slice1 <= resolution; slice1++) {
        var angle = Math.PI * 2.0 * slice1 / resolution;
        var cylinderpoint = xvector.times(Math.cos(angle)).plus(yvector.times(Math.sin(angle)));
        if (slice1 > 0) {
            // cylinder vertices:
            var vertices = [];
            vertices.push(new CSG.Vertex(p1.plus(cylinderpoint)));
            vertices.push(new CSG.Vertex(p1.plus(prevcylinderpoint)));
            vertices.push(new CSG.Vertex(p2.plus(prevcylinderpoint)));
            vertices.push(new CSG.Vertex(p2.plus(cylinderpoint)));
            polygons.push(new CSG.Polygon(vertices));
            var prevcospitch, prevsinpitch;
            for (var slice2 = 0; slice2 <= qresolution; slice2++) {
                var pitch = 0.5 * Math.PI * slice2 / qresolution;
                //var pitch = Math.asin(slice2/qresolution);
                var cospitch = Math.cos(pitch);
                var sinpitch = Math.sin(pitch);
                if (slice2 > 0) {
                    vertices = [];
                    vertices.push(new CSG.Vertex(p1.plus(prevcylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                    vertices.push(new CSG.Vertex(p1.plus(cylinderpoint.times(prevcospitch).minus(zvector.times(prevsinpitch)))));
                    if (slice2 < qresolution) {
                        vertices.push(new CSG.Vertex(p1.plus(cylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                    }
                    vertices.push(new CSG.Vertex(p1.plus(prevcylinderpoint.times(cospitch).minus(zvector.times(sinpitch)))));
                    polygons.push(new CSG.Polygon(vertices));
                    vertices = [];
                    vertices.push(new CSG.Vertex(p2.plus(prevcylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                    vertices.push(new CSG.Vertex(p2.plus(cylinderpoint.times(prevcospitch).plus(zvector.times(prevsinpitch)))));
                    if (slice2 < qresolution) {
                        vertices.push(new CSG.Vertex(p2.plus(cylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                    }
                    vertices.push(new CSG.Vertex(p2.plus(prevcylinderpoint.times(cospitch).plus(zvector.times(sinpitch)))));
                    vertices.reverse();
                    polygons.push(new CSG.Polygon(vertices));
                }
                prevcospitch = cospitch;
                prevsinpitch = sinpitch;
            }
        }
        prevcylinderpoint = cylinderpoint;
    }
    var result = CSG.fromPolygons(polygons);
    var ray = zvector.unit();
    var axisX = xvector.unit();
    result.properties.roundedCylinder = new CSG.Properties();
    result.properties.roundedCylinder.start = new CSG.Connector(p1, ray.negated(), axisX);
    result.properties.roundedCylinder.end = new CSG.Connector(p2, ray, axisX);
    result.properties.roundedCylinder.facepoint = p1.plus(xvector);
    return result;
};

/** Construct an elliptic cylinder.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.start=[0,-1,0]] - start point of cylinder
 * @param {Vector3D} [options.end=[0,1,0]] - end point of cylinder
 * @param {Vector2D} [options.radius=[1,1]] - radius of rounded ends, must be two dimensional array
 * @param {Vector2D} [options.radiusStart=[1,1]] - OPTIONAL radius of rounded start, must be two dimensional array
 * @param {Vector2D} [options.radiusEnd=[1,1]] - OPTIONAL radius of rounded end, must be two dimensional array
 * @param {Number} [options.resolution=CSG.defaultResolution2D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 *     var cylinder = CSG.cylinderElliptic({
 *       start: [0, -10, 0],
 *       end: [0, 10, 0],
 *       radiusStart: [10,5],
 *       radiusEnd: [8,3],
 *       resolution: 16
 *     });
 */

CSG.cylinderElliptic = function(options) {
    var s = CSG.parseOptionAs3DVector(options, "start", [0, -1, 0]);
    var e = CSG.parseOptionAs3DVector(options, "end", [0, 1, 0]);
    var r = CSG.parseOptionAs2DVector(options, "radius", [1,1]);
    var rEnd = CSG.parseOptionAs2DVector(options, "radiusEnd", r);
    var rStart = CSG.parseOptionAs2DVector(options, "radiusStart", r);

    if((rEnd._x < 0) || (rStart._x < 0) || (rEnd._y < 0) || (rStart._y < 0) ) {
        throw new Error("Radius should be non-negative");
    }
    if((rEnd._x === 0 || rEnd._y === 0) && (rStart._x === 0 || rStart._y === 0)) {
        throw new Error("Either radiusStart or radiusEnd should be positive");
    }

    var slices = CSG.parseOptionAsInt(options, "resolution", CSG.defaultResolution2D); // FIXME is this correct?
    var ray = e.minus(s);
    var axisZ = ray.unit(); //, isY = (Math.abs(axisZ.y) > 0.5);
    var axisX = axisZ.randomNonParallelVector().unit();

    //  var axisX = new CSG.Vector3D(isY, !isY, 0).cross(axisZ).unit();
    var axisY = axisX.cross(axisZ).unit();
    var start = new CSG.Vertex(s);
    var end = new CSG.Vertex(e);
    var polygons = [];

    function point(stack, slice, radius) {
        var angle = slice * Math.PI * 2;
        var out = axisX.times(radius._x * Math.cos(angle)).plus(axisY.times(radius._y * Math.sin(angle)));
        var pos = s.plus(ray.times(stack)).plus(out);
        return new CSG.Vertex(pos);
    }
    for(var i = 0; i < slices; i++) {
        var t0 = i / slices,
        t1 = (i + 1) / slices;

        if(rEnd._x == rStart._x && rEnd._y == rStart._y) {
            polygons.push(new CSG.Polygon([start, point(0, t0, rEnd), point(0, t1, rEnd)]));
            polygons.push(new CSG.Polygon([point(0, t1, rEnd), point(0, t0, rEnd), point(1, t0, rEnd), point(1, t1, rEnd)]));
            polygons.push(new CSG.Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
        } else {
            if(rStart._x > 0) {
                polygons.push(new CSG.Polygon([start, point(0, t0, rStart), point(0, t1, rStart)]));
                polygons.push(new CSG.Polygon([point(0, t0, rStart), point(1, t0, rEnd), point(0, t1, rStart)]));
            }
            if(rEnd._x > 0) {
                polygons.push(new CSG.Polygon([end, point(1, t1, rEnd), point(1, t0, rEnd)]));
                polygons.push(new CSG.Polygon([point(1, t0, rEnd), point(1, t1, rEnd), point(0, t1, rStart)]));
            }
        }
    }
    var result = CSG.fromPolygons(polygons);
    result.properties.cylinder = new CSG.Properties();
    result.properties.cylinder.start = new CSG.Connector(s, axisZ.negated(), axisX);
    result.properties.cylinder.end = new CSG.Connector(e, axisZ, axisX);
    result.properties.cylinder.facepoint = s.plus(axisX.times(rStart));
    return result;
};

/** Construct an axis-aligned solid rounded cuboid.
 * @param {Object} [options] - options for construction
 * @param {Vector3D} [options.center=[0,0,0]] - center of rounded cube
 * @param {Vector3D} [options.radius=[1,1,1]] - radius of rounded cube, single scalar is possible
 * @param {Number} [options.roundradius=0.2] - radius of rounded edges
 * @param {Number} [options.resolution=CSG.defaultResolution3D] - number of polygons per 360 degree revolution
 * @returns {CSG} new 3D solid
 *
 * @example
 * var cube = CSG.roundedCube({
 *   center: [2, 0, 2],
 *   radius: 15,
 *   roundradius: 2,
 *   resolution: 36,
 * });
 */
CSG.roundedCube = function(options) {
    var minRR = 1e-2; //minroundradius 1e-3 gives rounding errors already
    var center, cuberadius;
    options = options || {};
    if (('corner1' in options) || ('corner2' in options)) {
        if (('center' in options) || ('radius' in options)) {
            throw new Error("roundedCube: should either give a radius and center parameter, or a corner1 and corner2 parameter");
        }
        corner1 = CSG.parseOptionAs3DVector(options, "corner1", [0, 0, 0]);
        corner2 = CSG.parseOptionAs3DVector(options, "corner2", [1, 1, 1]);
        center = corner1.plus(corner2).times(0.5);
        cuberadius = corner2.minus(corner1).times(0.5);
    } else {
        center = CSG.parseOptionAs3DVector(options, "center", [0, 0, 0]);
        cuberadius = CSG.parseOptionAs3DVector(options, "radius", [1, 1, 1]);
    }
    cuberadius = cuberadius.abs(); // negative radii make no sense
    var resolution = CSG.parseOptionAsInt(options, "resolution", CSG.defaultResolution3D);
    if (resolution < 4) resolution = 4;
    if (resolution%2 == 1 && resolution < 8) resolution = 8; // avoid ugly
    var roundradius = CSG.parseOptionAs3DVector(options, "roundradius", [0.2, 0.2, 0.2]);
    // slight hack for now - total radius stays ok
    roundradius = CSG.Vector3D.Create(Math.max(roundradius.x, minRR), Math.max(roundradius.y, minRR), Math.max(roundradius.z, minRR));
    var innerradius = cuberadius.minus(roundradius);
    if (innerradius.x < 0 || innerradius.y < 0 || innerradius.z < 0) {
        throw('roundradius <= radius!');
    }
    var res = CSG.sphere({radius:1, resolution:resolution});
    res = res.scale(roundradius);
    innerradius.x > CSG.EPS && (res = res.stretchAtPlane([1, 0, 0], [0, 0, 0], 2*innerradius.x));
    innerradius.y > CSG.EPS && (res = res.stretchAtPlane([0, 1, 0], [0, 0, 0], 2*innerradius.y));
    innerradius.z > CSG.EPS && (res = res.stretchAtPlane([0, 0, 1], [0, 0, 0], 2*innerradius.z));
    res = res.translate([-innerradius.x+center.x, -innerradius.y+center.y, -innerradius.z+center.z]);
    res = res.reTesselated();
    res.properties.roundedCube = new CSG.Properties();
    res.properties.roundedCube.center = new CSG.Vertex(center);
    res.properties.roundedCube.facecenters = [
        new CSG.Connector(new CSG.Vector3D([cuberadius.x, 0, 0]).plus(center), [1, 0, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([-cuberadius.x, 0, 0]).plus(center), [-1, 0, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, cuberadius.y, 0]).plus(center), [0, 1, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, -cuberadius.y, 0]).plus(center), [0, -1, 0], [0, 0, 1]),
        new CSG.Connector(new CSG.Vector3D([0, 0, cuberadius.z]).plus(center), [0, 0, 1], [1, 0, 0]),
        new CSG.Connector(new CSG.Vector3D([0, 0, -cuberadius.z]).plus(center), [0, 0, -1], [1, 0, 0])
    ];
    return res;
};

/** Create a polyhedron using Openscad style arguments.
 * Define face vertices clockwise looking from outside.
 * @param {Object} [options] - options for construction
 * @returns {CSG} new 3D solid
 */
CSG.polyhedron = function(options) {
    options = options || {};
    if (('points' in options) !== ('faces' in options)) {
        throw new Error("polyhedron needs 'points' and 'faces' arrays");
    }
    var vertices = CSG.parseOptionAs3DVectorList(options, "points", [
            [1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [-1, 1, 0],
            [0, 0, 1]
        ])
        .map(function(pt) {
            return new CSG.Vertex(pt);
        });
    var faces = CSG.parseOption(options, "faces", [
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4],
            [1, 0, 3],
            [2, 1, 3]
        ]);
    // Openscad convention defines inward normals - so we have to invert here
    faces.forEach(function(face) {
        face.reverse();
    });
    var polygons = faces.map(function(face) {
        return new CSG.Polygon(face.map(function(idx) {
            return vertices[idx];
        }));
    });

    // TODO: facecenters as connectors? probably overkill. Maybe centroid
    // the re-tesselation here happens because it's so easy for a user to
    // create parametrized polyhedrons that end up with 1-2 dimensional polygons.
    // These will create infinite loops at CSG.Tree()
    return CSG.fromPolygons(polygons).reTesselated();
};
