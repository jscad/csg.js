
  // Parse an option from the options object
  // If the option is not present, return the default value
  CSG.parseOption = function(options, optionname, defaultvalue) {
      var result = defaultvalue;
      if (options && optionname in options) {
            result = options[optionname];
      }
      return result;
  };

  // Parse an option and force into a CSG.Vector3D. If a scalar is passed it is converted
  // into a vector with equal x,y,z
  CSG.parseOptionAs3DVector = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      result = new CSG.Vector3D(result);
      return result;
  };

  CSG.parseOptionAs3DVectorList = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      return result.map(function(res) {
          return new CSG.Vector3D(res);
      });
  };

  // Parse an option and force into a CSG.Vector2D. If a scalar is passed it is converted
  // into a vector with equal x,y
  CSG.parseOptionAs2DVector = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      result = new CSG.Vector2D(result);
      return result;
  };

  CSG.parseOptionAsFloat = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      if (typeof(result) == "string") {
          result = Number(result);
      }
      if (isNaN(result) || typeof(result) != "number") {
          throw new Error("Parameter " + optionname + " should be a number");
      }
      return result;
  };

  CSG.parseOptionAsInt = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      result = Number(Math.floor(result));
      if (isNaN(result)) {
          throw new Error("Parameter " + optionname + " should be a number");
      }
      return result;
  };

  CSG.parseOptionAsBool = function(options, optionname, defaultvalue) {
      var result = CSG.parseOption(options, optionname, defaultvalue);
      if (typeof(result) == "string") {
          if (result == "true") result = true;
          else if (result == "false") result = false;
          else if (result == 0) result = false;
      }
      result = !!result;
      return result;
  };
