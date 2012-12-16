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
            if params.length == 0
                param = new Param
                    paramId: "cozybookmarks"
                    name: "Cozy bookmarks application name"
                    value: ""
                Param.create param, (err, param) ->
                    send [param]
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
