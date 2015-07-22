http  = require('http')
https = require('https')

zlib  = require('zlib')
iconv = require('iconv')
url   = require('url')

americano = require 'americano-cozy'

module.exports = Feed = americano.getModel 'Feed',
    'title': type: String
    'url': type: String
    'last': type: String
    'tags': type: JSON
    'description': type: String
    'content': type: String
    'created': type: Date, default: Date
    'updated': type: Date, default: Date


Feed.all = (params, callback) ->
    Feed.request "byTags", params, callback


base_decode = (buffer, encoding, opt) ->
    utf8 = "utf-8"
    if opt?
        utf8 += opt
    converter = new iconv.Iconv(encoding, utf8)
    try
        buffer  = converter.convert(buffer)
        content = buffer.toString()
    catch error
        content = ""

decode = (buffer, encoding) ->
    content  = base_decode(buffer, encoding)
    icontent = base_decode(buffer, encoding, "//translit//ignore")

    if encoding != "iso-8859-1" and content.length != icontent.length
        content = base_decode(buffer, "iso-8859-1", "//translit//ignore")

    content

getFeedBuffer = (feed, buffer, encoding) ->
    feed.content = decode(buffer, encoding)

isHttp = (uri) ->
    uri.slice(0, 4) == "http"


isHttps = (uri) ->
    uri.slice(0, 5) == "https"


getAbsoluteLocation = (uri, location) ->
    loc = location
    if loc.charAt(0) == '/'
        loc = uri.split('/').slice(0, 3).join('/') + loc
    if not isHttp(loc)
        loc = "http://" + loc
    loc


getEncoding = (res) ->
    charset = "utf-8"
    try
        contentType = res["headers"]["content-type"].split(";")
        for elem in contentType
            key_value = (str.trim() for str in elem.split("="))
            if key_value[0] == "charset"
                charset = key_value[1]
    catch error
        charset = "utf-8"

    charset


getFeed = (feed, uri, callback) ->
    if isHttps(uri)
        protocol = https
    else
        protocol = http
        if not isHttp(uri)
            uri = "http://" + uri

    parsed = url.parse(uri)
    headers=
        "User-Agent": "zero-feeds (nodejs)"
    get    =
        "hostname": parsed.hostname
        "path": parsed.path
        "headers": headers
        "rejectUnauthorized": false

    protocol.get(get, (res) ->
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
                               (err, buffer) -> getFeedBuffer(feed, buffer))
            else if res["headers"]? and res["headers"]["location"]?
                feed.url = getAbsoluteLocation(uri, res["headers"]["location"])
                feed.save()
                getFeed(feed, feed.url, () ->)
            else
                encoding = getEncoding(res)
                getFeedBuffer(feed, data, encoding)

            callback.call(feed)).on 'error',  ->
                callback.call("Error: can't join url")


Feed.prototype.update = (params, callback) ->
    feed = @
    feed.updated = new Date
    feed.content = ""
    feed.save()
    getFeed(feed, feed.url, callback)
