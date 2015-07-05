View = require "../lib/view"

module.exports = class ParamView extends View
    className: "checkbox"
    tagName: "div"

    constructor: (@model) ->
        super()

    template: ->
        template = require "./templates/param"
        template @getRenderData()

    events:
        "change input": "update"
    
    update: (evt) ->
        checked = @$el.find("input").prop("checked") or false
        @model.save { "value": checked }
        if checked
            $("body").addClass(@model.get("paramId"))
        else
            $("body").removeClass(@model.get("paramId"))
