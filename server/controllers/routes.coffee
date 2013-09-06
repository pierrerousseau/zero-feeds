feeds = require './feeds'
params = require './params'

module.exports =
    'feeds':
        get: feeds.all
        post: feeds.create
    'feeds/:id':
        put: feeds.update
        delete: feeds.destroy
    'params': 
        get: params.all
    'params/:id': 
        put: params.update
