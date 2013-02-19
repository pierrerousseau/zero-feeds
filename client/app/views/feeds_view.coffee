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
        feeds = $(evt.currentTarget).parents("div:first").find(".feed")
        feeds.show(() -> $(this).click())
        false

    onTagClicked: (evt) ->
        $(evt.currentTarget).find(".feed").toggle()
        false

    initialize: ->
        @collection = new FeedCollection @
