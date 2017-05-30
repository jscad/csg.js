// //////////////////////////////
// ## class fuzzyFactory
// This class acts as a factory for objects. We can search for an object with approximately
// the desired properties (say a rectangle with width 2 and height 1)
// The lookupOrCreate() method looks for an existing object (for example it may find an existing rectangle
// with width 2.0001 and height 0.999. If no object is found, the user supplied callback is
// called, which should generate a new object. The new object is inserted into the database
// so it can be found by future lookupOrCreate() calls.
// Constructor:
//   numdimensions: the number of parameters for each object
//     for example for a 2D rectangle this would be 2
//   tolerance: The maximum difference for each parameter allowed to be considered a match
CSG.fuzzyFactory = function (numdimensions, tolerance) {
  this.lookuptable = {}
  this.multiplier = 1.0 / tolerance
}

CSG.fuzzyFactory.prototype = {
    // var obj = f.lookupOrCreate([el1, el2, el3], function(elements) {/* create the new object */});
    // Performs a fuzzy lookup of the object with the specified elements.
    // If found, returns the existing object
    // If not found, calls the supplied callback function which should create a new object with
    // the specified properties. This object is inserted in the lookup database.
  lookupOrCreate: function (els, creatorCallback) {
    var hash = ''
    var multiplier = this.multiplier
    els.forEach(function (el) {
      var valueQuantized = Math.round(el * multiplier)
      hash += valueQuantized + '/'
    })
    if (hash in this.lookuptable) {
      return this.lookuptable[hash]
    } else {
      var object = creatorCallback(els)
      var hashparts = els.map(function (el) {
        var q0 = Math.floor(el * multiplier)
        var q1 = q0 + 1
        return ['' + q0 + '/', '' + q1 + '/']
      })
      var numelements = els.length
      var numhashes = 1 << numelements
      for (var hashmask = 0; hashmask < numhashes; ++hashmask) {
        var hashmask_shifted = hashmask
        hash = ''
        hashparts.forEach(function (hashpart) {
          hash += hashpart[hashmask_shifted & 1]
          hashmask_shifted >>= 1
        })
        this.lookuptable[hash] = object
      }
      return object
    }
  }
}

// ////////////////////////////////////
CSG.fuzzyCSGFactory = function () {
  this.vertexfactory = new CSG.fuzzyFactory(3, CSG.EPS)
  this.planefactory = new CSG.fuzzyFactory(4, CSG.EPS)
  this.polygonsharedfactory = {}
}

CSG.fuzzyCSGFactory.prototype = {
  getPolygonShared: function (sourceshared) {
    var hash = sourceshared.getHash()
    if (hash in this.polygonsharedfactory) {
      return this.polygonsharedfactory[hash]
    } else {
      this.polygonsharedfactory[hash] = sourceshared
      return sourceshared
    }
  },

  getVertex: function (sourcevertex) {
    var elements = [sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z]
    var result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  },

  getPlane: function (sourceplane) {
    var elements = [sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z, sourceplane.w]
    var result = this.planefactory.lookupOrCreate(elements, function (els) {
      return sourceplane
    })
    return result
  },

  getPolygon: function (sourcepolygon) {
    var newplane = this.getPlane(sourcepolygon.plane)
    var newshared = this.getPolygonShared(sourcepolygon.shared)
    var _this = this
    var newvertices = sourcepolygon.vertices.map(function (vertex) {
      return _this.getVertex(vertex)
    })
        // two vertices that were originally very close may now have become
        // truly identical (referring to the same CSG.Vertex object).
        // Remove duplicate vertices:
    var newvertices_dedup = []
    if (newvertices.length > 0) {
      var prevvertextag = newvertices[newvertices.length - 1].getTag()
      newvertices.forEach(function (vertex) {
        var vertextag = vertex.getTag()
        if (vertextag != prevvertextag) {
          newvertices_dedup.push(vertex)
        }
        prevvertextag = vertextag
      })
    }
        // If it's degenerate, remove all vertices:
    if (newvertices_dedup.length < 3) {
      newvertices_dedup = []
    }
    return new CSG.Polygon(newvertices_dedup, newshared, newplane)
  },

  getCSG: function (sourcecsg) {
    var _this = this
    var newpolygons = []
    sourcecsg.polygons.forEach(function (polygon) {
      var newpolygon = _this.getPolygon(polygon)
            // see getPolygon above: we may get a polygon with no vertices, discard it:
      if (newpolygon.vertices.length >= 3) {
        newpolygons.push(newpolygon)
      }
    })
    return CSG.fromPolygons(newpolygons)
  }
}
