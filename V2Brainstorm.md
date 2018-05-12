# Aims
simpler, functional oriented, descriptive api


## functional modules

* instead of adding a ton of things to an object prototype , we favor simple, 
specialized functions, each in their own module (no/less circular dependendcies, better overview,
better for future code splitting etc)

* this is partially inspired by gl-matrix and particularly its offshoots/forks : gl-vec2, gl-vec3, gl-vec4

## Order of parameters

* options first, objects after that : 
 * to make functions curryable
 * to accomodate for variable amount of objects passed in etc


## capabilities

### general

#### 'scene'/ object hierarchy and transforms are not implicit/ baked in
  ie in V1, there were no transforms (position/rotation/scale, transformation matrix) available, as soon as you transformed
  and object ie translate([0,10,1], shape1) , ALL of shape1's vertices where transformed
  this 
   * can be quite wastefull, and prevents efficient re-use
   * does not allow for object hierarchies
  If you want for example to create a system to show assembled/ disassembled versions of a design, you can now just apply a different transformation matrix, and leave the bulk of the work for displaying things in the right place to the scenegraph/GPU which is considerably faster than changing every vertex every frame
  * any booleans/ operations that alter the geometry itself (vertices), should not be conflated with more generic transforms

#### properties

  ##### purpose

    properties are mean to make taging & reusing signficant aspects of a part easier

  ##### implementation

    properties can now be considered a special type of data that is simply added as a child of a shape/part
    thus they get transformed like any item in the scene graph in a normal manner (local vs parent transforms etc)

    ie (pseudo code)

    ```javascript
    const myPart = {
      transform: [0, 0, 0, 0 , 1, 1, 1 ,0...] // transform relative to parent
      children: [
        {
          type:'property',
          name: 'somecoolstuff',
          transform: [0, 0, 0, 0 , 1, 1, 1 ,0...] // transform relative to parent
        }

      ]
    }
    ```

### 2D shapes

* descriptive : data describes each path segment/ curve that makes up a complex 2D shape
* seperation of concerns : data vs internal representation
  * we do not recompute the polygons everytime a different line segment or bezier curve is added
  * we describe : [point1, point2, handle1, handle2]
* only distinction between a set of paths and a shape, is whether or not it is closed

#### implementation

  ie (pseudo code)

    ```javascript
    const myshape2 = {
      name:'superShapy!',
      transform: [0, 0, 0, 0 , 1, 1, 1 ,0...]
      segments: [
        {
          points: [
            [0,0], [10, 100]// start at [0,0], go to [10, 100]
          ],
          type:'line'
        },
        {
          points: [
            [10,100, 20, 17], [0, 0, 2, 36]// start at [10,100], go to [0, 0], by way of a bezier curve
          ],
          type:'bezier'
        }
      ]
    }
    ```