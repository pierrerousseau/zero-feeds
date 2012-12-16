View = require '../lib/view'

module.exports = class ParamView extends View
    className: 'param'
    tagName: 'div'

    constructor: (@model) ->
        super()

    template: ->
        template = require './templates/param'
        template @getRenderData()
