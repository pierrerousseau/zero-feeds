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

    reloadCounts: ($target) ->
        feeds  = $target.find ".feed"
        $(feed).find(".feed-count").click() for feed in feeds

    onReloadTagClicked: (evt) ->
        $target = $(evt.currentTarget).parents ".tag:first"
        @reloadCounts($target)

        false

    cleanLinks: () ->
        existingLinks = $(".link")
        existingLinks.remove()

    onTagClicked: (evt) ->
        $target = $(evt.currentTarget).parent ".tag:first"
        if $target.hasClass "tag-open"
            $target.removeClass "tag-open"
            $target.addClass "tag-close"
            @cleanLinks()
        else
            $target.removeClass "tag-close"
            $target.addClass "tag-open"

        @reloadCounts($target)

        false

    initialize: ->
        @collection = new FeedCollection @
