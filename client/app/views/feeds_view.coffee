ViewCollection = require '../lib/view_collection'
FeedView       = require './feed_view'
FeedCollection = require '../collections/feed_collection'

module.exports = class FeedsView extends ViewCollection
    el: '#panel-feeds'

    view: FeedView

    events:
        "click .tag-title": "onTagClicked"
        "click .tag-refresh": "onReloadTagClicked"

        "mouseenter .tag-header": "setToFullHover"
        "mouseleave .tag-header": "setToNotFullHover"
        
    setToFullHover: (evt) ->
        target = $(evt.currentTarget).parents ".tag:first"
        target.addClass("hover")

    setToNotFullHover: (evt) ->
        target = $(evt.currentTarget).parents ".tag:first"
        target.removeClass("hover")

    onReloadTagClicked: (evt) ->
        target = $(evt.currentTarget).parents ".tag:first"
        feeds  = target.find ".feed"
        feeds.trigger "click"
        false

    onTagClicked: (evt) ->
        target = $(evt.currentTarget).parent ".tag:first"
        if target.hasClass "tag-open"
            target.removeClass "tag-open"
            target.addClass "tag-close"
        else
            target.removeClass "tag-close"
            target.addClass "tag-open"

        feeds  = target.find ".feed"
        $(feed).find(".feed-count").click() for feed in feeds

        false

    initialize: ->
        @collection = new FeedCollection @
