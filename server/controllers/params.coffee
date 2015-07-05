Param = require "../models/zfparam"

useQuickmarks =
    "paramId": "use-quickmarks"
    "description": "Use the quickmarks app to save links"
    "value": false

showOldLinks =
    "paramId": "show-old-links"
    "description": "Show new and old links"
    "value": false

useLightColors =
    "paramId": "use-light-colors"
    "description": "Use light colors for the interface"
    "value": false

availableParams = [
    useQuickmarks,
    showOldLinks,
    useLightColors
]

cleanParams = (params) ->
    newParams = []

    for param in params
        found = false
        for availableParam in availableParams
            if param.paramId == availableParam.paramId
                found = true
                break
        if not found
            param.destroy()
        else
            newParams.push param

    newParams

addMissingParams = (params) ->
    for availableParam in availableParams
        found = false
        for param in params
            if param.paramId == availableParam.paramId
                found = true
                break
        if not found
            newParam = new Param availableParam
            Param.create newParam
            params.push newParam

    params


module.exports.all = (req, res) ->
    Param.all (err, params) ->
        if err?
            console.log err
            errorMsg = "Server error occured while retrieving data."
            res.send error: true, msg: errorMsg
        else
            params = cleanParams(params)
            params = addMissingParams(params)
            
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
