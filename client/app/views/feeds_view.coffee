ViewCollection = require '../lib/view_collection'
FeedView       = require './feed_view'
FeedCollection = require '../collections/feed_collection'

module.exports = class FeedsView extends ViewCollection
    el: '.feeds'

    view: FeedView

    initialize: ->
        @collection = new FeedCollection @
