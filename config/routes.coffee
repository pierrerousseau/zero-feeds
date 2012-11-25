exports.routes = (map) ->
    map.get 'feeds', 'feeds#all'
    map.post 'feeds', 'feeds#create'
    map.del 'feeds/:id', 'feeds#destroy'
