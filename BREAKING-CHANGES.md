
# CSG/CAG Objects
    - removal of almost all methods
    TODO: list here 

# API

    - snake case methods are now camel case: ie chain_hull => chainHull
    - a SINGLE function per shape : no more CSG.sphere() vs sphere()
      - unified functions keep the openscad shortcuts, but also add more explicit ones
        - ie : h => height, fn => segments

  ## Transformations

    - expand/contract is now only expand, with negative values
    - rotate, translate, scale do NOT do implicit UNIONS anymore => array in, array out

  ## Primitives

    - square => rectangle
    - circle => ellipse
    - triangle => GONE

    - cube => cuboid
    - sphere => spheroid ? (not sure about this one)

  ## Extrusions

    - rectangular_extrude (basePoints, params) => rectangularExtrude(params, basePoints)
    - linear_extrude => linearExtrude
    - rotate_extrude => rotateExtrude
    - extrusions of 2d shapes with no edges (sides length === 0) will now throw an error
    - solidFromSlices(polygon, options) => solidFromSlices(options, polygon)


# Things to fix:

- rectangular_extrude's 'round' option was actually never used !!