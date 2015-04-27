americano = require 'americano'

port = process.env.PORT || 31436
americano.start name: 'Zero-Feeds', port: port, (err, app, server) ->
    require("./server/models/zfparam").removeOldParams()
