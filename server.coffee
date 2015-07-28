americano = require 'americano'

port = process.env.PORT || 31436
americano.start name: 'Zero-Feeds', port: port, (err, app, server) ->
    require("./server/models/zfparam").removeOldParams()
    Feed = americano.getModel 'Feed',
        'title': type: String
        'url': type: String
        'last': type: String
        'tags': type: JSON
        'description': type: String
        'content': type: String
        'created': type: Date, default: Date
        'updated': type: Date, default: Date
    Feed.request "byTags", (err, feeds) ->
        for feed in feeds
            if typeof feed.tags is "string"
                tags = feed.tags.split(",")
                feed.tags = tags
                feed.save()
