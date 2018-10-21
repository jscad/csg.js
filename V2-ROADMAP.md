

# OVERVIEW

## The past

The current version of CSG.js has been built over  a long time, by adding a lot of features on top of the original csg.js
Up until recently there where :
  - no unit tests
  - no coherence requirement
  - no overarching intent
  - no checks for duplicate features or partially implemented ones
  - a double API: the 'old' object oriented API and a functional API
  - no linting
  - a blind trust in what came before 
  - barebones documentation, that was written at various stages of development and thus partially outdated or flat out 
  false in some cases
  - no decoupling between API & implementation
  - not using standards or modules (up until recently all of csg was a few GIANT files)

The end result at this stage is to put it midly, a big mess, that has become increasingly hard to maintain and expand

## Goals

### API: 
  - cleaned up, unified , 'coherent' : ie 
    - functional API only: easier to expand, easier to work with, more granular, easy to understand
    - coherent parameter positions: based on the Ramda logic, options first, data second ! 
    - coherent parameter names: right now we have a giant mess for example: 
      'r' in some functions
      'radius' in some others
      'diameter' is sometimes supported, sometimes not, sometimes 'd' is used instead etc
    - correct primitive & function names, that actually represent what they are doing ! (square => rectangle, cube => cuboid etc)
  - decouple api & implementation
    - we want to be able to change the internals of the csg algorithm & data structures without breaking everything
    in the process
      - for example we have been looking into f-rep, b-rep, half edges
    - see [vtree experiments](https://github.com/kaosat-dev/jscad-tree-experiments) for a working system based on V1
  - keep the immutability of the API, it is sane, avoids issues with accidental mutation
    - note that this does NOT mean that there cannot be mutable parts in the 'core' (behind the scenes)
  
### Internals: 
  - simplification of data structures and functions (they should do one thing & do it well)
    - vertices, points, polygons etc all have deeply nested, overly complex data structures
    - the whole use of 'tags' on the above to find identical instances is overly complex and should be removed (the code predates weakmaps, sets etc)
  
  - use webgl & js environement more inteligently
    - a shorter path to webgl would be ideal to avoid having to regenerate geometry useable by webgl (this note is only valid as long as we use triangle based structures obviously)
    - seperate object TRANSFORMS (transformation matrix) from object STRUCTURE: 
  
  - use arrays & typed arrays with functions to manipulate their data rather than overly complex , shoe-horned classes where applicable
  - use of more modern standards & structures: ES6 is our friend ! more readable code , weakmaps, sets , iterators, your name it !

  - do not reinvent the wheel, but avoid dependency bloat
  - optimise (but avoid premature optimisation)

### Small core, big ecosystem 

'less is more': possibly remove things from the 'core' into 'user space' 
  - a lot of contributions had to be refused because they added too specific code to the 'core', despite providing good
  features: we feel most contributions are valid, but instead of having a giant 'do it all but not well core', we want to make finding, importing & using small , specialized pieces of code easier

  - Solutions:
    - use of node modules to distribute user created helpers & designs (this works very well in practice)
    - support es6 modules when they are ready (requires universal support for the dynamic `import()` statement)
    - the future website (not just )

### Documentation & examples

- we need to have an actual site (this is not specific to csg, but to jscad in general) with examples and documentation, preferably with live/ interactive examples (should be way easier now that the new ui allows for multiple instances of jscad per page)

## Details

# BREAKING CHANGES

details are [here](V2-BREAKING-CHANGES.md)

# BRAINSTORMING

details are [here](V2-BRAINSTORM.md)

# Notes

- for documentation prefer markdown files over wiki
  - no need for infrastructure
  - single source of truth
  - can be distributed easilly (desktop app, docs generation etc)
  - 'kiss' principle

