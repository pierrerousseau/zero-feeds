Param = require '../models/param'

module.exports = class ParamCollection extends Backbone.Collection

    model: Param
    url: 'params'

    constructor: (@view) ->
        super()

        @bind "add", @view.renderOne
        @bind "reset", @view.renderAll
