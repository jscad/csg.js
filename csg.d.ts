
declare module '@jscad/csg' {

    class Vector3
    {
        x: number;
        y: number;
        z: number;
    }
    class Vertex
    {
        pos: Vector3;
        tag: number;

        [key: string]: any;
    }

    class Plane
    {
        normal: Vector3;
    }
    class Polygon
    {
        plane: Plane;
        shared;
        vertices: Vertex[];
    }

    class CSG
    {
        polygons: Polygon[];
        isCanonicalized: boolean;
        isRetesselated: boolean;
        properties: any;

        toTriangles(): Polygon[];

        subtract(csg: CSG): this;

        //join face to convex polygons,return new csg.
        reTesselated(): this;
        //like mergeVertices,return new csg.
        canonicalized(): this;
    }

    class CAG
    {
        static fromPointsNoCheck(points: [number, number][]): CAG;
        reTesselated(): this;

        extrude(options: { offset: [number, number, number] = [0, 0, 1], twistangle?: number = 0, twiststeps?: number = 1 }): CSG;
    }
}
