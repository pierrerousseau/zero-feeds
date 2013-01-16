before ->
    Param.find req.params.id, (err, param) =>
        if err or !param
            send error: true, msg: "Param not found", 404
        else
            @param = param
            next()
, only: ['update']

action 'all', ->
    Param.all (err, params) ->
        if err
            railway.logger.write err
            send error: true, msg: "Server error occured while retrieving data."
        else
            paramsNames = ["cozy-bookmarks-name", "show-new-links"]
            for param in params
                if !(param.paramId in paramsNames)
                    param.destroy()
            if params.length < paramsNames.length
                newParams = []
                for paramName in paramsNames
                    found = false
                    for param in params
                        if param.name == paramsNames
                            found = true
                            newParams.push(param)
                    if !found
                        if paramName == "cozy-bookmarks-name"
                            newParam = new Param
                                paramId: "cozy-bookmarks-name"
                                name: "Cozy bookmarks application name"
                                value: ""
                        else
                            newParam = new Param
                                paramId: "show-new-links"
                                name: "Display only new links"
                                value: true
                        Param.create newParam
                        newParams.push(newParam)
                send newParams
            else
                send params

action 'update', ->
    ['value'].forEach (field) =>
        if field == 'value'
            @param[field] = req.body[field] if req.body[field]?

    console.log(@param)
    @param.update params, (err) ->
        if err
            railway.logger.write err
            send error: 'Cannot update param', 500
        else
            send @
