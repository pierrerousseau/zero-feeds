Feed = require '../models/feed'

module.exports = class FeedCollection extends Backbone.Collection

    model: Feed
    url: 'feeds'

    constructor: (@view) ->
        super()

        @bind "add", @view.renderOne
        @bind "reset", @view.renderAll