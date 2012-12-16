all = ->
    emit doc.tags, doc

Feed.defineRequest "all", all, (err) ->
    if err
        railway.logger.write "Feed All requests, cannot be created"
        railway.logger.write err

allParams = ->
    emit doc.name, doc

Param.defineRequest "all", allParams, (err) ->
    if err
        railway.logger.write "Param All requests, cannot be created"
        railway.logger.write err
