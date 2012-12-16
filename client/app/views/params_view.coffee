ViewCollection  = require '../lib/view_collection'
ParamView       = require './param_view'
ParamCollection = require '../collections/param_collection'

module.exports = class ParamsView extends ViewCollection
    el: '.params div.fields'

    view: ParamView

    initialize: ->
        @collection = new ParamCollection @

    renderOne: (model) =>
        view = new @view model
        @$el.append view.render().el
        @add view
        @
