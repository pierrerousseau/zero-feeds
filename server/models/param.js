// Generated by CoffeeScript 1.7.1
var Param, americano;

americano = require('americano-cozy');

module.exports = Param = americano.getModel('Param', {
  'paramId': {
    type: String
  },
  'name': {
    type: String
  },
  'value': {
    type: String
  }
});

Param.all = function(params, callback) {
  return Param.request("all", params, callback);
};

Param.prototype.update = function(params, callback) {
  var param;
  param = this;
  param.save();
  return callback.call(param);
};
