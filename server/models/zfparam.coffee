americano = require 'americano-cozy'
http      = require 'http'

module.exports = Param = americano.getModel 'ZFParam',
    'paramId': type: String
    'name': type: String
    'value': type: String

Param.removeOldParams = () ->
    OldParam = americano.getModel 'Param',
        'paramId': type: String
    OldParam.request "all", (err, found) ->
        if found
            if found.length is 2
                if found[0].paramId is "cozy-bookmarks-name"
                    if found[1].paramId is "show-new-links"
                        OldParam.destroyAll () ->
                            console.log "Old parameters have been destroyed"

Param.all = (params, callback) ->
    Param.request "all", params, callback

Param.prototype.update = (params, callback) ->
    param = @
    param.save()
    callback.call(param)
