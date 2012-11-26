before ->
    Feed.find req.params.id, (err, feed) =>
        if err or !feed
            send error: true, msg: "Feed not found", 404
        else
            @feed = feed
            next()
, only: ['destroy', 'update']


action 'all', ->
    Feed.all (err, feeds) ->
        if err
            railway.logger.write err
            send error: true, msg: "Server error occured while retrieving data."
        else
            send feeds

action 'create', ->
    Feed.create req.body, (err, feed) =>
        if err
            send error: true, msg: "Server error while creating feed.", 500
        else
            send feed

action 'destroy', ->
    @feed.destroy (err) ->
        if err
            railway.logger.write err
            send error: 'Cannot destroy feed', 500
        else
            send success: 'Feed succesfuly deleted'

action 'update', ->
    ['title', 'content'].forEach (field) =>
        if field == 'title'
            @feed[field] = req.body[field] if req.body[field]?

    @feed.update params, (err) ->
        if err
            railway.logger.write err
            send error: 'Cannot update feed', 500
        else
            send @
