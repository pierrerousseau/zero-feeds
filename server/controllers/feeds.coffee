Feed = require '../models/feed'

module.exports.all = (req, res) ->
    Feed.all (err, feeds) ->
        if err
            console.log err
            errorMsg = "Server error occured while retrieving data."
            res.send error: true, msg: errorMsg
        else
            res.send feeds

module.exports.create = (req, res) ->
    Feed.create req.body, (err, feed) =>
        if err
            res.send error: true, msg: "Server error while creating feed.", 500
        else
            res.send feed

module.exports.destroy = (req, res) ->
    Feed.find req.params.id, (err, feed) ->
        if err? or not feed?
            res.send error: true, msg: "Feed not found", 404
        else
            feed.destroy (err) ->
                if err
                    console.log err
                    res.send error: 'Cannot destroy feed', 500
                else
                    res.send success: 'Feed succesfuly deleted'

module.exports.update = (req, res) ->

    Feed.find req.params.id, (err, feed) ->
        if err? or not feed?
            res.send error: true, msg: "Feed not found", 404
        else
            ['title', 'last', 'content'].forEach (field) =>
                if field is 'title' or field is 'last'
                    feed[field] = req.body[field] if req.body[field]?

            feed.update req.params, (err) ->
                if err?
                    console.log err
                    res.send error: 'Cannot update feed', 500
                else
                    res.send feed
