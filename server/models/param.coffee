americano = require 'americano-cozy'

module.exports = Param = americano.getModel 'Param',
    'paramId': type: String
    'name': type: String
    'value': type: String

Param.all = (params, callback) ->
    Param.request "all", params, callback

Param.prototype.update = (params, callback) ->
    param = @
    param.save()
    callback.call(param)
