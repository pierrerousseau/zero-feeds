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
        "click h1": "showOnlyTitle"
        "click .icon-new": "displayNewForm"
        "click .icon-help": "toggleHelp"
        "click .icon-settings": "toggleSettings"
        
        "click form.new-feed .icon-add": "addFeed"
        
        "click form.settings .icon-update": "updateSettings"
        "change #show-new-links": "toggleOldLinks"

        "click .link .to-cozy-bookmarks": "toCozyBookMarks"
        "click .link .icon-more": "linkDetails"

    startWaiter: ($elem) ->
        html = "<img " + 
               "src='images/loader.gif' " + 
               "class='main loader' " + 
               "alt='loading ...' />"
        $elem.append html

    stopWaiter: ($elem) ->
        $elem.find(".main.loader").remove()

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
        if $(".feeds").width() / $("body").width() < 10
            $(".feeds").css("max-width", "17em")

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
        $(".help").toggle()
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
            success: (elem) =>
                elems = $("." + elem.cid)
                elems.not(".clone").click()
                elems.parents(".tag").find(".feed").show()
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

    toCozyBookMarks: (evt) =>
        url = $(evt.target).parents(".link:first").find("> a").attr("href")
        ajaxOptions =
            type: "POST",
            url: "../../apps/" + $("#cozy-bookmarks-name").val() + "/bookmarks",
            data: { url: url, tags: ["cozy-feeds"] }
            success: () ->
                alertify.log "link added to cozy-bookmarks"
            error: () ->
                alertify.alert "link wasn't added to cozy-bookmarks"
        $.ajax(ajaxOptions)
        false
    
    linkDetails: (evt) =>
        $(evt.target).parents(".link:first").find(".description").toggle()
