http = require('http')

Feed.all = (params, callback) ->
    Feed.request "all", params, callback

Feed.prototype.update = (params, callback) ->
    feed = @
    http.get feed.url, (res) ->
        data = ''
        res.on 'data', (chunk) ->
            data += chunk.toString()
        res.on 'end', () ->
            feed.updated = new Date
            feed.content = data
            feed.save()
            callback.call(feed)
