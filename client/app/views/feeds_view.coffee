ViewCollection = require '../lib/view_collection'
FeedView       = require './feed_view'
FeedCollection = require '../collections/feed_collection'

module.exports = class FeedsView extends ViewCollection
    el: '.feeds'

    view: FeedView

    events:
        "click .tag": "onTagClicked"
        "click .tag .icon-reload": "onReloadTagClicked"

    onReloadTagClicked: (evt) ->
        target = $(evt.currentTarget).parent().parent().parent()
        feeds  = target.find ".feed"

        for feed in feeds
            $(feed).trigger 'click'
        false

    onTagClicked: (evt) ->
        target = $(evt.currentTarget)
        feeds  = target.find ".feed"
        target.toggleClass 'active'
        target.find(".feed").toggle()
        for feed in feeds
            $(feed).find(".count").click()
        false

    initialize: ->
        @collection = new FeedCollection @

    renderAll: ->
        @collection.models.reverse()
        super()
