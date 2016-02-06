module.exports = class View extends Backbone.View
    tagName: 'section'

    template: ->

    initialize: ->
        @render()

    getRenderData: ->
        model: @model?.toJSON()

    render: ->
        # console.debug "Rendering #{@constructor.name}", @
        @beforeRender()
        @$el.html @template({})
        @afterRender()
        @

    beforeRender: ->

    afterRender: ->

    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        @remove()
        Backbone.View::remove.call @

    @confirm: (text, cb) ->
        $ -> (new PNotify
            "text": text
            "icon": false
            "hide": false
            "type": "info"
            "confirm":
                "confirm": true
            "buttons":
                "sticker": false
            "width": "40%").get().on "pnotify.confirm", () ->
                cb()

    @error: (text) ->
        $ -> new PNotify
            "text": text
            "icon": false
            "hide": false
            "type": "error"
            "buttons":
                "sticker": false

    @log: (text) ->
        $ -> new PNotify
            "text": text
            "icon": false
            "opacity": .8
            "delay": 2000
            "buttons":
                "sticker": false
