module.exports = class Param extends Backbone.Model

    urlRoot: 'params'

    isNew: () ->
        not @id?
