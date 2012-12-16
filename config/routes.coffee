exports.routes = (map) ->
    map.get 'feeds', 'feeds#all'
    map.post 'feeds', 'feeds#create'
    map.del 'feeds/:id', 'feeds#destroy'
    map.put 'feeds/:id', 'feeds#update'
    map.get 'params', 'params#all'
    map.put 'params/:id', 'params#update'
