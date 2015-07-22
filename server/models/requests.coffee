americano = require 'americano-cozy'

module.exports =
    feed:
        byTags: (doc) -> emit doc.tags, doc
    zfparam:
        byName: (doc) -> emit doc.name, doc
