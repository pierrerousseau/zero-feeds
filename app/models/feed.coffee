http = require('http')
https = require('https')

zlib = require('zlib')

Feed.all = (params, callback) ->
    Feed.request "all", params, callback

saveFeedBuffer = (feed, buffer) ->
    feed.content = buffer.toString("UTF-8")
    feed.updated = new Date
    feed.save()

Feed.prototype.update = (params, callback) ->
    feed = @
    if feed.url.slice(0, 5) == "https"
        protocol = https
    else 
        protocol = http
        if feed.url.slice(0, 4) != "http"
            feed.url = "http://" + feed.url

    protocol.get(feed.url, (res) ->
        data   = ''
        chunks = []
        length = 0

        res.on 'data', (chunk) ->
            chunks.push(chunk)
            length += chunk.length
        res.on 'end', () ->
            data = Buffer.concat(chunks, length)
            if res["headers"]? and res["headers"]["content-encoding"]?
                gziped = res["headers"]["content-encoding"] == "x-gzip"
            else
                gziped = false

            if gziped
                zlib.unzip(data, (err, buffer) -> saveFeedBuffer(feed, buffer))
            else
                saveFeedBuffer(feed, data)

            callback.call(feed)).on 'error',  ->
                callback.call("Error: can't join url")
