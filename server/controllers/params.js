// Generated by CoffeeScript 1.7.1
var Param, addMissingParams, availableParams, cleanParams, showOldLinks, useLightColors, useQuickmarks;

Param = require("../models/zfparam");

useQuickmarks = {
  "paramId": "use-quickmarks",
  "description": "Use the quickmarks app to save links",
  "value": false
};

showOldLinks = {
  "paramId": "show-old-links",
  "description": "Show new and old links",
  "value": false
};

useLightColors = {
  "paramId": "use-light-colors",
  "description": "Use light colors for the interface",
  "value": false
};

availableParams = [useQuickmarks, showOldLinks, useLightColors];

cleanParams = function(params) {
  var availableParam, found, newParams, param, _i, _j, _len, _len1;
  newParams = [];
  for (_i = 0, _len = params.length; _i < _len; _i++) {
    param = params[_i];
    found = false;
    for (_j = 0, _len1 = availableParams.length; _j < _len1; _j++) {
      availableParam = availableParams[_j];
      if (param.paramId === availableParam.paramId) {
        found = true;
        break;
      }
    }
    console.log(param.paramId, found);
    if (!found) {
      param.destroy();
    } else {
      newParams.push(param);
    }
  }
  return newParams;
};

addMissingParams = function(params) {
  var availableParam, found, newParam, param, _i, _j, _len, _len1;
  for (_i = 0, _len = availableParams.length; _i < _len; _i++) {
    availableParam = availableParams[_i];
    found = false;
    for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
      param = params[_j];
      if (param.paramId === availableParam.paramId) {
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(availableParam);
      newParam = new Param({
        "paramId": availableParam.paramId,
        "description": availableParam.description,
        "value": availableParam.value
      });
      console.log(newParam);
      Param.create(newParam);
      params.push(newParam);
    }
  }
  return params;
};

module.exports.all = function(req, res) {
  return Param.all(function(err, params) {
    var errorMsg;
    if (err != null) {
      console.log(err);
      errorMsg = "Server error occured while retrieving data.";
      return res.send({
        error: true,
        msg: errorMsg
      });
    } else {
      params = cleanParams(params);
      params = addMissingParams(params);
      return res.send(params);
    }
  });
};

module.exports.update = function(req, res) {
  return Param.find(req.params.id, function(err, param) {
    if ((err != null) || (param == null)) {
      return res.send({
        error: true,
        msg: "Param not found"
      }, 404);
    } else {
      ['value'].forEach(function(field) {
        if (field === 'value') {
          if (req.body[field] != null) {
            return param[field] = req.body[field];
          }
        }
      });
      return param.update(req.params, function(err) {
        if (err) {
          console.log(err);
          return res.send({
            error: 'Cannot update param'
          }, 500);
        } else {
          return res.send(param);
        }
      });
    }
  });
};
