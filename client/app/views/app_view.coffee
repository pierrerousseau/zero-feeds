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
        "click .icon-import": "import"
        "change #feeds-file": "uploadFile"
        
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
    
    addFeedFromFile: (feedObj) ->
        feed = new Feed feedObj
        @feedsView.collection.create feed,
            success: (elem) =>
                imported = $(".imported")
                if imported.text()
                    imported.text(parseInt(imported.text()) + 1)
                else
                    imported.text(1)
                $("." + elem.cid).parents(".tag").find(".feed").show()
            error: =>
                notImported = $(".import-failed")
                if notImported.text()
                    notImported.text(parseInt(notImported.text()) + 1)
                else
                    notImported.text(1)

    addFeedFromHTMLFile: (link) ->
        $link = $ link
        if $link.attr("feedurl")
            url         = $link.attr "feedurl"
            title       = $link.text()
            description = ""
            next = $link.parents(":first").next()
            if next.is("dd")
                description = next.text()
            feedObj =
                url: url
                tags: [""]
                description: description
            @addFeedFromFile feedObj
    
    addFeedsFromHTMLFile: (loaded) ->
        links = loaded.find "dt a"
        for link in links
            @addFeedFromHTMLFile link

    addFeedFromOPMLFile: (link, tag) ->
        $link = $ link
        if $link.attr("xmlUrl")
            url         = $link.attr "xmlUrl"
            title       = $link.attr "title"
            description = $link.attr "text"

            feedObj =
                url: url
                tags: [tag]
                description: description
            @addFeedFromFile feedObj
    
    addFeedsFromOPMLFile: (loaded) ->
        links = loaded.find "> outline"
        for link in links
            $link = $ link
            if $link.attr("xmlUrl")
                @addFeedFromOPMLFile link, ""
            else
                tag = $link.attr("title")
                taggedLinks = $link.find "outline"
                for taggedLink in taggedLinks
                    @addFeedFromOPMLFile taggedLink, tag

    addFeedsFromFile: (file) ->
        loaded = $(file)
        if loaded.is("opml")
            @addFeedsFromOPMLFile loaded
        else
            @addFeedsFromHTMLFile loaded

    isUnknownFormat: (file) ->
        return file.type != "text/html" and file.type != "text/xml" and 
            file.type != "text/x-opml+xml"

    uploadFile: (evt) ->
        file = evt.target.files[0]
        if @isUnknownFormat file
            alertify.alert "This file cannot be imported"
            return

        reader = new FileReader()
        reader.onload = (evt) => @addFeedsFromFile(evt.target.result)
        reader.readAsText(file)

    import: (evt) ->
        alertify.confirm "Import opml rss file or " + 
                         "html bookmarks file containing feeds exported by " +
                         "firefox or chrome",
            (ok) -> if ok
                $("#feeds-file").click()
