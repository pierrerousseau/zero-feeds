Feed = define 'Feed', ->
    property 'title', String
    property 'url', String
    property 'tags', String
    property 'description', Text
    property 'created', Date, default: Date
