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
        "click .icon-settings": "displaySettings"
        "click form.new-feed .icon-add": "addFeed"
        "click form.settings .icon-update": "updateSettings"
        "change #show-new-links": "showLinks"

    template: ->
        require('./templates/home')

    initialize: ->
        @router = CozyApp.Routers.AppRouter = new AppRouter()

    showOnlyTitle: ->
        $(".new-feed").hide()
        $(".settings").hide()

    displayNewForm: ->
        $(".new-feed").show("slow")
        false

    displaySettings: ->
        $(".settings").toggle("slow")
        false

    afterRender: ->
        $(".url-field").focus()
        @feedsView = new FeedsView()
        @feedsView.$el.html '<em>loading...</em>'
        @feedsView.collection.fetch
            success: =>
                @feedsView.$el.find('em').remove()
        @paramsView = new ParamsView()
        @paramsView.$el.html '<em>loading...</em>'
        @paramsView.collection.fetch
            success: =>
                @paramsView.$el.find('em').remove()

    addFeed: (event) =>
        url   = $('.url-field').val()
        tags  = $('.tags-field').val().split(',').map (tag) -> $.trim(tag)

        if url?.length > 0
            feed = new Feed
                url: url
                tags: tags
            event.preventDefault()
            @feedsView.collection.create feed,
                success: =>
                    alertify.log "" + url + " added"
                    $("form.new-feed").find("input").val("")
                error: =>
                    alertify.alert "Server error occured, " +
                                   "feed was not added"
        else
            alertify.alert "Url field is required"
        false

    showLinks: (evt) ->
        $("ul.links").toggleClass("show-old")
        $("button.show-new").toggle()
        $("button.show-old").toggle()
        false

    updateSettings: (event) =>
        for param in @paramsView.collection.models
            if param.attributes.paramId == "show-new-links"
                checked = $("." + param.attributes.paramId).attr("checked")
                param.attributes.value = checked != undefined
            else
                param.attributes.value = $("." + param.attributes.paramId).val()
            param.save()
        false

