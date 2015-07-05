View       = require '../lib/view'
AppRouter  = require '../routers/app_router'
FeedsView  = require './feeds_view'
ParamsView = require './params_view'
Feed       = require '../models/feed'

module.exports = class AppView extends View
    el: 'body.application'

    template: ->
        require('./templates/home')

    events:
        "click .link": "linkDetails"
        "submit .add-one-feed": "addFeed"

    startWaiter: ($elem) ->
        html = "<img " +
               "src='images/loader.gif' " +
               "class='main loader' " +
               "alt='loading ...' />"
        $elem.append html

    stopWaiter: ($elem) ->
        $elem.find(".main.loader").remove()

    afterRender: ->
        @feedsView = new FeedsView()
        @startWaiter(@feedsView.$el)
        @feedsView.collection.fetch
            success: =>
                @stopWaiter(@feedsView.$el)

        @paramsView = new ParamsView()
        @startWaiter(@paramsView.$el)
        @paramsView.collection.fetch
            success: (view, parameters) =>
                @updateSettings()
                @stopWaiter(@paramsView.$el)

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    cleanAddFeedForm: ->
        $(".add-one-feed").find("input").val("")

    createFeed: (evt, url, tags) ->
        feed = new Feed
            url: url
            tags: tags
        @feedsView.collection.create feed,
            success: (elem) =>
                elems = $("." + elem.cid)
                tags = elems.parents(".tag-close")
                for tag in tags
                    tag = $(tag)
                    $(tag).find(".tag-title").click()
                tags = elems.parents(".tag-open")
                for tag in tags
                    tag = $(tag)
                    $(tag).find("." + elem.cid + " .feed-count").click()
                @cleanAddFeedForm()
            error: =>
                View.error "Server error occured, feed was not added"

    addFeed: (evt) =>
        url  = $("#add-feed-url").val()
        tags = $("#add-feed-tags").val().split(',').map (tag) -> $.trim(tag)

        if url?.length > 0
            @createFeed(evt, url, tags)
            evt.preventDefault()
        else
            View.error "Url field is required"

        false

    updateSettings: () =>
        for parameter in @paramsView.collection.models
            value = parameter.get("value")
            id    = parameter.get("paramId")
            if value == "true"
                $("body").addClass(id)
            else
                $("body").removeClass(id)

    linkDetails: (evt) =>
        link   = $(evt.currentTarget)
        if not $(evt.target).is("a")
            link.toggleClass "link-active"
