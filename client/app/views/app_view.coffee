View       = require '../lib/view'
AppRouter  = require '../routers/app_router'
FeedsView  = require './feeds_view'
ParamsView = require './params_view'
Feed       = require '../models/feed'

module.exports = class AppView extends View
    el: 'body.application'

    events:
        "click h1": "showOnlyTitle"
        "click .icon-new": "displayNewForm"
        "click .icon-help": "toggleHelp"
        "click .icon-settings": "toggleSettings"
        
        "click form.new-feed .icon-add": "addFeed"
        
        "click form.settings .icon-update": "updateSettings"
        "change #show-new-links": "toggleOldLinks"

    template: ->
        require('./templates/home')

    startWaiter: ($elem) ->
        # TODO: see how to dry it with the feed_view method
        html = 
            "<img src='images/loader.gif' class='loader' alt='loading ...' />"
        $elem.append html

    stopWaiter: ($elem) ->
        # TODO: see how to dry it with the feed_view method
        $elem.find(".loader").remove()

    toggleOldLinks: (evt) ->
        $("ul.links").toggleClass("show-old")
        false

    applyParameters: (parameters) ->
        # TODO: check what to do for cozy bookmarks update
        for parameter in parameters
            if parameter.paramId == "show-new-links" and not parameter.value
                @toggleOldLinks()
                break

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
                @applyParameters(parameters)
                @stopWaiter(@paramsView.$el)

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    showOnlyTitle: ->
        $(".new-feed").hide()
        $(".settings").hide()
        $(".help").hide()

    displayNewForm: ->
        $(".new-feed").show()
        $(".url-field").focus()
        false

    toggleHelp: ->
        $(".help").toggle("slow")
        false

    toggleSettings: ->
        $(".settings").toggle()
        false

    cleanAddFeedForm: ->
        $("form.new-feed").find("input").val("")

    createFeed: (evt, url, tags) ->
        feed = new Feed
            url: url
            tags: tags
        @feedsView.collection.create feed,
            success: =>
                alertify.log "" + url + " added"
                @cleanAddFeedForm()
            error: =>
                alertify.alert "Server error occured, feed was not added"

    addFeed: (evt) =>
        url  = $('.url-field').val()
        tags = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)

        if url?.length > 0
            @createFeed(evt, url, tags)
            evt.preventDefault()
        else
            alertify.alert "Url field is required"

        false

    updateSettings: (evt) =>
        for parameter in @paramsView.collection.models
            if parameter.attributes.paramId == "show-new-links"
                checked = $("." + parameter.attributes.paramId).attr("checked")
                parameter.attributes.value = checked != undefined
            else
                parameter.attributes.value = 
                    $("." + parameter.attributes.paramId).val()
            parameter.save()

        false
