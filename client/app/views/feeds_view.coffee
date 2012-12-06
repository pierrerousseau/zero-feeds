ViewCollection = require '../lib/view_collection'
FeedView       = require './feed_view'
FeedCollection = require '../collections/feed_collection'

module.exports = class FeedsView extends ViewCollection
    el: '.feeds'

    view: FeedView

    initialize: ->
        @collection = new FeedCollection @

    renderOne: (model, all) =>
        view = new @view model
        if all.eachAll
            @$el.append view.render().el
        else
            @$el.prepend view.render().el
        @add view
        @

    renderAll: =>
        @collection.each (model) => @renderOne model, { "eachAll": true }
        @
