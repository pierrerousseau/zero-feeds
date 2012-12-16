Param.all = (params, callback) ->
    Param.request "all", params, callback

Param.prototype.update = (params, callback) ->
    param = @
    param.save()
    callback.call(param)
