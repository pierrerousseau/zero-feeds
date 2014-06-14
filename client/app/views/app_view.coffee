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
        "click .btn.new": "displayNewForm"
        "click .btn.help": "toggleHelp"
        "click .btn.settings": "toggleSettings"
        "click .btn.import": "import"
        "change #feeds-file": "uploadFile"

        "submit form.new-feed": "addFeed"

        "keyup #cozy-bookmarks-name": "updateSettings"
        "change #show-new-links": "toggleOldLinks"

        "click .link .to-cozy-bookmarks": "toCozyBookMarks"
        "click .link .btn.view-description": "linkDetails"

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
        @updateSettings(evt)
        false

    applyParameters: (parameters) ->
        # TODO: check what to do for cozy bookmarks update
        for parameter in parameters
            if parameter.paramId is "show-new-links"
                if parameter.value is "false"
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

    hideToggled: ->
        $(".new-feed").slideUp()
        $("div.help").slideUp()
        $("form.settings").slideUp()
        $(".menu .buttons .active").removeClass 'active'

    displayNewForm: ->
        @hideToggled()
        unless $(".new-feed").is(':visible')
            $(".menu .buttons .btn.new").addClass 'active'
            $(".new-feed").slideDown()
            $(".url-field").focus()
        false

    toggleHelp: ->
        @hideToggled()
        unless $("div.help").is(':visible')
            $(".menu .buttons .btn.help").addClass 'active'
            $("div.help").slideDown()
        false

    toggleSettings: ->
        @hideToggled()
        unless $("form.settings").is(':visible')
            $(".menu .buttons .btn.cog").addClass 'active'
            $("form.settings").slideDown()
        false

    cleanAddFeedForm: ->
        $("form.new-feed").find("input").val("")

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
        if not evt
            return false
        for parameter in @paramsView.collection.models
            paramId = parameter.attributes.paramId
            name    = parameter.attributes.name
            $elem = $("#" + paramId)
            if paramId is "show-new-links" and paramId is evt.target.id
                checked = $elem.prop("checked")
                parameter.save { "value": checked },
                    success: () ->
                        alertify.log name + " saved"
                    error: () ->
                        alertify.alert name + " not saved"
                break
            else if paramId is evt.target.id
                app = $elem.val()
                if @settingsSaveTimer?
                    clearTimeout @settingsSaveTimer
                @settingsSaveTimer = setTimeout (() ->
                    parameter.save { "value": app },
                        success: () ->
                            alertify.log name + " saved"
                        error: () ->
                            alertify.alert name + " not saved")
                    , 1000
                break

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
        link = $(evt.target).parents(".link:first")
        
        link.toggleClass 'active'
        link.find(".btn.view-description").toggleClass 'active'
        link.find(".description").slideToggle()

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
        return file.type isnt "text/html" and file.type isnt "text/xml" and
            file.type isnt "text/x-opml+xml"

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
