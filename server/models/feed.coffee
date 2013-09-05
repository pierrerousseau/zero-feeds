http = require('http')
https = require('https')

zlib = require('zlib')

americano = require 'americano-cozy'

module.exports = Feed = americano.getModel 'Feed',
    'title': type: String
    'url': type: String
    'last': type: String
    'tags': type: String
    'description': type: String
    'content': type: String
    'created': type: Date, default: Date
    'updated': type: Date, default: Date

Feed.all = (params, callback) ->
    Feed.request "all", params, callback

saveFeedBuffer = (feed, buffer) ->
    feed.content = buffer.toString("UTF-8")
    feed.updated = new Date
    feed.save()

isHttp = (url) ->
    url.slice(0, 4) == "http"

getAbsoluteLocation = (url, location) ->
    loc = location
    if loc.charAt(0) == '/'
        loc = url.split('/').slice(0, 3).join('/') + loc
    if not isHttp(loc)
        loc = "http://" + loc
    loc


getFeed = (feed, url, callback) ->
    if url.slice(0, 5) == "https"
        protocol = https
    else
        protocol = http
        if not isHttp(url)
            url = "http://" + url

    protocol.get(url, (res) ->
        data   = ''
        chunks = []
        length = 0

        res.on 'data', (chunk) ->
            chunks.push(chunk)
            length += chunk.length
        res.on 'end', () ->
            data = Buffer.concat(chunks, length)
            if res["headers"]? and res["headers"]["content-encoding"]?
                if res["headers"]["content-encoding"] == "x-gzip"
                    zlib.unzip(data,
                               (err, buffer) -> saveFeedBuffer(feed, buffer))
            else if res["headers"]? and res["headers"]["location"]?
                feed.url = getAbsoluteLocation(url, res["headers"]["location"])
                feed.save()
                getFeed(feed, feed.url, () ->)
            else
                saveFeedBuffer(feed, data)

            callback.call(feed)).on 'error',  ->
                callback.call("Error: can't join url")

Feed.prototype.update = (params, callback) ->
    feed = @
    getFeed(feed, feed.url, callback)
