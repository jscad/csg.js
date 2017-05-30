
  // # class PolygonTreeNode
  // This class manages hierarchical splits of polygons
  // At the top is a root node which doesn hold a polygon, only child PolygonTreeNodes
  // Below that are zero or more 'top' nodes; each holds a polygon. The polygons can be in different planes
  // splitByPlane() splits a node by a plane. If the plane intersects the polygon, two new child nodes
  // are created holding the splitted polygon.
  // getPolygons() retrieves the polygon from the tree. If for PolygonTreeNode the polygon is split but
  // the two split parts (child nodes) are still intact, then the unsplit polygon is returned.
  // This ensures that we can safely split a polygon into many fragments. If the fragments are untouched,
  //  getPolygons() will return the original unsplit polygon instead of the fragments.
  // remove() removes a polygon from the tree. Once a polygon is removed, the parent polygons are invalidated
  // since they are no longer intact.
  // constructor creates the root node:
  CSG.PolygonTreeNode = function () {
    this.parent = null
    this.children = []
    this.polygon = null
    this.removed = false
  }

  CSG.PolygonTreeNode.prototype = {
      // fill the tree with polygons. Should be called on the root node only; child nodes must
      // always be a derivate (split) of the parent node.
    addPolygons: function (polygons) {
      if (!this.isRootNode())
          // new polygons can only be added to root node; children can only be splitted polygons
            {
        throw new Error('Assertion failed')
      }
      var _this = this
      polygons.map(function (polygon) {
        _this.addChild(polygon)
      })
    },

      // remove a node
      // - the siblings become toplevel nodes
      // - the parent is removed recursively
    remove: function () {
      if (!this.removed) {
        this.removed = true

        if (_CSGDEBUG) {
          if (this.isRootNode()) throw new Error('Assertion failed') // can't remove root node
          if (this.children.length) throw new Error('Assertion failed') // we shouldn't remove nodes with children
        }

              // remove ourselves from the parent's children list:
        var parentschildren = this.parent.children
        var i = parentschildren.indexOf(this)
        if (i < 0) throw new Error('Assertion failed')
        parentschildren.splice(i, 1)

              // invalidate the parent's polygon, and of all parents above it:
        this.parent.recursivelyInvalidatePolygon()
      }
    },

    isRemoved: function () {
      return this.removed
    },

    isRootNode: function () {
      return !this.parent
    },

      // invert all polygons in the tree. Call on the root node
    invert: function () {
      if (!this.isRootNode()) throw new Error('Assertion failed') // can only call this on the root node
      this.invertSub()
    },

    getPolygon: function () {
      if (!this.polygon) throw new Error('Assertion failed') // doesn't have a polygon, which means that it has been broken down
      return this.polygon
    },

    getPolygons: function (result) {
      var children = [this]
      var queue = [children]
      var i, j, l, node
      for (i = 0; i < queue.length; ++i) { // queue size can change in loop, don't cache length
        children = queue[i]
        for (j = 0, l = children.length; j < l; j++) { // ok to cache length
          node = children[j]
          if (node.polygon) {
                      // the polygon hasn't been broken yet. We can ignore the children and return our polygon:
            result.push(node.polygon)
          } else {
                      // our polygon has been split up and broken, so gather all subpolygons from the children
            queue.push(node.children)
          }
        }
      }
    },

      // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
      // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
      // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
      //  and added to both arrays.
    splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      if (this.children.length) {
        var queue = [this.children], i, j, l, node, nodes
        for (i = 0; i < queue.length; i++) { // queue.length can increase, do not cache
          nodes = queue[i]
          for (j = 0, l = nodes.length; j < l; j++) { // ok to cache length
            node = nodes[j]
            if (node.children.length) {
              queue.push(node.children)
            } else {
                          // no children. Split the polygon:
              node._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
            }
          }
        }
      } else {
        this._splitByPlane(plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes)
      }
    },

      // only to be called for nodes with no children
    _splitByPlane: function (plane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      var polygon = this.polygon
      if (polygon) {
        var bound = polygon.boundingSphere()
        var sphereradius = bound[1] + CSG.EPS // FIXME Why add imprecision?
        var planenormal = plane.normal
        var spherecenter = bound[0]
        var d = planenormal.dot(spherecenter) - plane.w
        if (d > sphereradius) {
          frontnodes.push(this)
        } else if (d < -sphereradius) {
          backnodes.push(this)
        } else {
          var splitresult = plane.splitPolygon(polygon)
          switch (splitresult.type) {
            case 0:
                          // coplanar front:
              coplanarfrontnodes.push(this)
              break

            case 1:
                          // coplanar back:
              coplanarbacknodes.push(this)
              break

            case 2:
                          // front:
              frontnodes.push(this)
              break

            case 3:
                          // back:
              backnodes.push(this)
              break

            case 4:
                          // spanning:
              if (splitresult.front) {
                var frontnode = this.addChild(splitresult.front)
                frontnodes.push(frontnode)
              }
              if (splitresult.back) {
                var backnode = this.addChild(splitresult.back)
                backnodes.push(backnode)
              }
              break
          }
        }
      }
    },

      // PRIVATE methods from here:
      // add child to a node
      // this should be called whenever the polygon is split
      // a child should be created for every fragment of the split polygon
      // returns the newly created child
    addChild: function (polygon) {
      var newchild = new CSG.PolygonTreeNode()
      newchild.parent = this
      newchild.polygon = polygon
      this.children.push(newchild)
      return newchild
    },

    invertSub: function () {
      var children = [this]
      var queue = [children]
      var i, j, l, node
      for (i = 0; i < queue.length; i++) {
        children = queue[i]
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j]
          if (node.polygon) {
            node.polygon = node.polygon.flipped()
          }
          queue.push(node.children)
        }
      }
    },

    recursivelyInvalidatePolygon: function () {
      var node = this
      while (node.polygon) {
        node.polygon = null
        if (node.parent) {
          node = node.parent
        }
      }
    }
  }

  // # class Tree
  // This is the root of a BSP tree
  // We are using this separate class for the root of the tree, to hold the PolygonTreeNode root
  // The actual tree is kept in this.rootnode
  CSG.Tree = function (polygons) {
    this.polygonTree = new CSG.PolygonTreeNode()
    this.rootnode = new CSG.Node(null)
    if (polygons) this.addPolygons(polygons)
  }

  CSG.Tree.prototype = {
    invert: function () {
      this.polygonTree.invert()
      this.rootnode.invert()
    },

      // Remove all polygons in this BSP tree that are inside the other BSP tree
      // `tree`.
    clipTo: function (tree, alsoRemovecoplanarFront) {
      alsoRemovecoplanarFront = alsoRemovecoplanarFront ? true : false
      this.rootnode.clipTo(tree, alsoRemovecoplanarFront)
    },

    allPolygons: function () {
      var result = []
      this.polygonTree.getPolygons(result)
      return result
    },

    addPolygons: function (polygons) {
      var _this = this
      var polygontreenodes = polygons.map(function (p) {
        return _this.polygonTree.addChild(p)
      })
      this.rootnode.addPolygonTreeNodes(polygontreenodes)
    }
  }

  // # class Node
  // Holds a node in a BSP tree. A BSP tree is built from a collection of polygons
  // by picking a polygon to split along.
  // Polygons are not stored directly in the tree, but in PolygonTreeNodes, stored in
  // this.polygontreenodes. Those PolygonTreeNodes are children of the owning
  // CSG.Tree.polygonTree
  // This is not a leafy BSP tree since there is
  // no distinction between internal and leaf nodes.
  CSG.Node = function (parent) {
    this.plane = null
    this.front = null
    this.back = null
    this.polygontreenodes = []
    this.parent = parent
  }

  CSG.Node.prototype = {
      // Convert solid space to empty space and empty space to solid space.
    invert: function () {
      var queue = [this]
      var i, node
      for (var i = 0; i < queue.length; i++) {
        node = queue[i]
        if (node.plane) node.plane = node.plane.flipped()
        if (node.front) queue.push(node.front)
        if (node.back) queue.push(node.back)
        var temp = node.front
        node.front = node.back
        node.back = temp
      }
    },

      // clip polygontreenodes to our plane
      // calls remove() for all clipped PolygonTreeNodes
    clipPolygons: function (polygontreenodes, alsoRemovecoplanarFront) {
      var args = {'node': this, 'polygontreenodes': polygontreenodes }
      var node
      var stack = []

      do {
        node = args.node
        polygontreenodes = args.polygontreenodes

              // begin "function"
        if (node.plane) {
          var backnodes = []
          var frontnodes = []
          var coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes
          var plane = node.plane
          var numpolygontreenodes = polygontreenodes.length
          for (i = 0; i < numpolygontreenodes; i++) {
            var node1 = polygontreenodes[i]
            if (!node1.isRemoved()) {
              node1.splitByPlane(plane, coplanarfrontnodes, backnodes, frontnodes, backnodes)
            }
          }

          if (node.front && (frontnodes.length > 0)) {
            stack.push({'node': node.front, 'polygontreenodes': frontnodes})
          }
          var numbacknodes = backnodes.length
          if (node.back && (numbacknodes > 0)) {
            stack.push({'node': node.back, 'polygontreenodes': backnodes})
          } else {
                      // there's nothing behind this plane. Delete the nodes behind this plane:
            for (var i = 0; i < numbacknodes; i++) {
              backnodes[i].remove()
            }
          }
        }
        args = stack.pop()
      } while (typeof (args) !== 'undefined')
    },

      // Remove all polygons in this BSP tree that are inside the other BSP tree
      // `tree`.
    clipTo: function (tree, alsoRemovecoplanarFront) {
      var node = this, stack = []
      do {
        if (node.polygontreenodes.length > 0) {
          tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront)
        }
        if (node.front) stack.push(node.front)
        if (node.back) stack.push(node.back)
        node = stack.pop()
      } while (typeof (node) !== 'undefined')
    },

    addPolygonTreeNodes: function (polygontreenodes) {
      var args = {'node': this, 'polygontreenodes': polygontreenodes }
      var node
      var stack = []
      do {
        node = args.node
        polygontreenodes = args.polygontreenodes

        if (polygontreenodes.length === 0) {
          args = stack.pop()
          continue
        }
        var _this = node
        if (!node.plane) {
          var bestplane = polygontreenodes[0].getPolygon().plane
          node.plane = bestplane
        }
        var frontnodes = []
        var backnodes = []

        for (var i = 0, n = polygontreenodes.length; i < n; ++i) {
          polygontreenodes[i].splitByPlane(_this.plane, _this.polygontreenodes, backnodes, frontnodes, backnodes)
        }

        if (frontnodes.length > 0) {
          if (!node.front) node.front = new CSG.Node(node)
          stack.push({'node': node.front, 'polygontreenodes': frontnodes})
        }
        if (backnodes.length > 0) {
          if (!node.back) node.back = new CSG.Node(node)
          stack.push({'node': node.back, 'polygontreenodes': backnodes})
        }

        args = stack.pop()
      } while (typeof (args) !== 'undefined')
    },

    getParentPlaneNormals: function (normals, maxdepth) {
      if (maxdepth > 0) {
        if (this.parent) {
          normals.push(this.parent.plane.normal)
          this.parent.getParentPlaneNormals(normals, maxdepth - 1)
        }
      }
    }
  }
