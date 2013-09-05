Param = require '../models/param'

module.exports.all = (req, res) ->
    Param.all (err, params) ->
        if err?
            console.log err
            errorMsg = "Server error occured while retrieving data."
            res.send error: true, msg: errorMsg
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
                        if paramName is "cozy-bookmarks-name"
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
                res.send newParams
            else
                res.send params

module.exports.update = (req, res) ->
    Param.find req.params.id, (err, param) ->
        if err? or not param?
            res.send error: true, msg: "Param not found", 404
        else
            ['value'].forEach (field) ->
                if field is 'value'
                    param[field] = req.body[field] if req.body[field]?

            param.update req.params, (err) ->
                if err
                    console.log err
                    res.send error: 'Cannot update param', 500
                else
                    res.send param
