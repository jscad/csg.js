
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

    - TODO: add extrusion changes

  ## Primitives

    - square => rectangle
    - circle => ellipse
    - triangle => GONE

    - cube => cuboid
    - sphere => spheroid ? (not sure about this one)

  ## Extrusions

    - rectangular_extrude (basePoints, params) => rectangularExtrude(params, basePoints)


# Things to fix:

- rectangular_extrude's 'round' option was actually never used !!