View      = require '../lib/view'
AppRouter = require '../routers/app_router'
FeedsView = require './feeds_view'
Feed      = require '../models/feed'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        'click form .icon-add': 'onCreateClicked'

    template: ->
        require('./templates/home')

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    afterRender: ->
        $(".url-field").focus()
        @feedsView = new FeedsView()

        @feedsView.$el.html '<em>loading...</em>'
        @feedsView.collection.fetch
            success: =>
                @feedsView.$el.find('em').remove()

    onCreateClicked: (event) =>
        url   = $('.url-field').val()
        title = $('.title-field').val()
        tags  = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)
        description = $('.description-field').val()

        if url?.length > 0
            feed = new Feed
                title: title
                url: url
                tags: tags
            event.preventDefault()
            @feedsView.collection.create feed,
                success: =>
                    $("form.new-feed").find("input, textarea").val("")
                    alertify.log "" + @$el.find(".title span").html() + " added"
                error: => alert "Server error occured, feed was not saved"
        else
            alert 'Url field is required'
        false
