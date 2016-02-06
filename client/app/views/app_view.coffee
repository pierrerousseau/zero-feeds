View       = require '../lib/view'
AppRouter  = require '../routers/app_router'
FeedsView  = require './feeds_view'
ParamsView = require './params_view'
Feed       = require '../models/feed'


tips = [
    "Follow a new link now or forget it.",
    "Zero-Feeds displays only the new links from your feeds, if you still want them, there is a parameter to change in the settings panel.",
    "Do not follow dozen of sites, you have better to do today than reading all the internet.",
    "No new link ? Good! You can start what matters now.",
    "Check your feeds only once a day.",
    "Better check your feeds in the evening, before going to bed.",
    "Visit all your feeds, open the interesting links in new tabs, close zero-feeds, start reading.",
    "Choose a category, and check all new interesting links in the category before doing something else.",
    "Something annoying with zero-feeds? Contact the author and solve this together.",
    "After reading new links every day for free months, take a break.",
    "Do not follow your feeds during your holidays.",
    "Do not follow your feeds during the weekend.",
    "Make sure that you are in a quiet place with enough time before starting to check your feeds.",
    "Share a link only you can answer to why it is an interesting link.",
    "Do not share a new information found in your feeds before you checked it elsewhere.",
    "When you are not sure about something, look at the poulp, or visit the help section.",
    "Visit the thread about zero-feeds in the cozy forum.",
    "Give a star to zero-feeds on github to put a smile on the author face.",
    "To modify a feed, remove it, it will be placed in the add a feed form, then change it and add the feed again."
    "Colors are too dark? There is a parameter in the settings panel to make all clear."
]


module.exports = class AppView extends View
    el: 'body.application'

    template: ->
        require('./templates/home')

    events:
        "click .link": "linkDetails"
        "click .welcome-add-feed": "showAddAFeed"
        "click .welcome-add-feeds": "showImportExport"
        "submit .add-one-feed": "addFeed"
        "change #import-file": "uploadFile"
        "submit .import": "import"

    startWaiter: ($elem) ->
        html = "<img " +
               "src='images/loader.gif' " +
               "class='main loader' " +
               "alt='loading ...' />"
        $elem.append html

    stopWaiter: ($elem) ->
        $elem.find(".main.loader").remove()

    showWelcome: () ->
        $("#menu-tabs-welcome a").tab("show")

    showLinks: () ->
        $("#menu-tabs-links a").tab("show")

    showAddAFeed: () ->
        $("#menu-tabs-add-feeds a").tab("show")

    showImportExport: () ->
        $("#menu-tabs-import-export a").tab("show")

    setTotd: () ->
        day = (new Date()).getDate() % tips.length
        $(".tip-of-the-day p:first").html(tips[day])

    afterRender: ->
        @setTotd()
        @feedsView = new FeedsView()
        @startWaiter(@feedsView.$el)
        @feedsView.collection.fetch
            success: (view, feeds) =>
                @stopWaiter(@feedsView.$el)
                if not feeds?.length
                    @showWelcome()
                else
                    @showLinks()

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
                console.log(elems)
                tags = elems.parents(".tag-open")
                for tag in tags
                    tag = $(tag)
                    $(tag).find(".tag-refresh").click()
                tags = elems.parents(".tag-close")
                for tag in tags
                    tag = $(tag)
                    $(tag).find(".tag-title").click()
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

    addFeedFromFile: (feedObj) ->
        feed = new Feed feedObj
        @feedsView.collection.create feed,
            success: (elem) =>
                imported = $(".import-success")
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
        console.log file.name, /.opml$/.test(file.name)
        return file.type isnt "text/html" and file.type isnt "text/xml" and
            file.type isnt "text/x-opml+xml" and
            not /.opml$/.test(file.name)

    uploadFile: (evt) ->
        file = evt.target.files[0]
        if @isUnknownFormat file
            View.error "This file cannot be imported"
            return

        reader = new FileReader()
        reader.onload = (evt) => @addFeedsFromFile(evt.target.result)
        reader.readAsText(file)

    import: (evt) ->
        $("#import-file").click()
        false
