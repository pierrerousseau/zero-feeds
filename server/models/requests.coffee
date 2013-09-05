americano = require 'americano-cozy'

module.exports =
    feed:
        all: (doc) -> emit doc.tags, doc
    param:
        all: (doc) -> emit doc.name, doc