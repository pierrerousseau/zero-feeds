americano = require 'americano-cozy'

module.exports =
    feed:
        all: (doc) -> emit doc.tags, doc
    zfparam:
        all: (doc) -> emit doc.name, doc
