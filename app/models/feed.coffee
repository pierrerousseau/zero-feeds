http = require('http')
https = require('https')

Feed.all = (params, callback) ->
    Feed.request "all", params, callback

Feed.prototype.update = (params, callback) ->
    feed = @
    if feed.url.slice(0, 5) == "https"
        protocol = https
    else 
        protocol = http
        if feed.url.slice(0, 4) != "http"
            feed.url = "http://" + feed.url

    protocol.get feed.url, (res) ->
        data = ''
        res.on 'data', (chunk) ->
            data += chunk.toString()
        res.on 'end', () ->
            feed.updated = new Date
            feed.content = data
            feed.save()
            callback.call(feed)
