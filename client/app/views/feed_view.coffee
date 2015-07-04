View         = require '../lib/view'
linkTemplate = require './templates/link'
tagTemplate  = require './templates/tag'

module.exports = class FeedView extends View
    className: 'feed'
    tagName: 'div'

    constructor: (@model, clone) ->
        @clone = clone
        super()

    template: ->
        template = require './templates/feed'
        template @getRenderData()

    events:
        "click": "onUpdateClicked"
        "click .feed-count": "setUpdate"
        "click .feed-delete": "onDeleteClicked"
        "mouseenter .feed-delete": "setToDelete"
        "mouseleave .feed-delete": "setToNotDelete"

    startWaiter: () ->
        @$el.addClass("feed-loading")

    stopWaiter: () ->
        @$el.removeClass("feed-loading")

    setToDelete: () ->
        @$el.addClass("to-delete")

    setToNotDelete: () ->
        @$el.removeClass("to-delete")

    addToTag: (tag) ->
        tmpl = tagTemplate
        tag  = tag or "untagged"

        tagPlace = $ "." + tag
        if tagPlace.length is 0
            tagPlace = $(tmpl({ "name": tag }))
            $("#panel-feeds").append tagPlace

        exists = tagPlace.find "." + @model.cid
        if $("." + @model.cid).length
            elem = new FeedView(@model, true).$el
            elem.addClass("clone")
        else
            elem = @$el

        if exists.length
            exists.replaceAll elem
        else
            tagPlace.find(".tag-feeds").append elem

    setCount: () ->
        count = @model.count()
        place = @$el.find(".feed-count")
        if count
            place.html count
            place.addClass("label")
        else
            place.html ""
            place.removeClass("label")

    setUpdate: () ->
        if @$el.is ":visible"
            @startWaiter()
            @model.save { "content": "" },
                success: =>
                    @stopWaiter()
                    @setCount()
                    setTimeout _.bind(@setUpdate, @),
                         ((1 + Math.floor(Math.random()*14)) * 60000)
                error: =>
                    @stopWaiter()
                    setTimeout _.bind(@setUpdate, @),
                         ((11 + Math.floor(Math.random()*14)) * 60000)
        false

    render: ->
        @$el.html @template({})
        @$el.addClass(@model.cid)

        if @clone
            return

        tags = @model.attributes.tags or ["untagged"]
        if typeof tags is "string"
            tags = tags.split ","
        for tag in tags
            @addToTag(tag)

        @

    feedClass: ->
        title = $.trim(@model.attributes.title)
        if title
            title.replace(/[\s!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g,
                          '')
        else
            "link" + @model.cid

    renderXml: ->
        withCozyBookmarks = $("#cozy-bookmarks-name").val()

        tmpl   = linkTemplate

        links  = @model.links
            "feedClass": @feedClass()
        if not links.length
            View.error "No link found, are you sure that the url is correct ?"
            return
        links.reverse()
        $.each links,
            (index, link) ->
                link.toCozyBookMarks = withCozyBookmarks
                $(".links").prepend($(tmpl(link)))

    onUpdateClicked: (evt) ->
        @startWaiter()
        evt.preventDefault()

        $target = $(evt.currentTarget)

        $allThat      = $("." + @model.cid)
        if $target.hasClass("feed-open")
            $target.removeClass("feed-open")
            existingLinks = $(".link")
            existingLinks.remove()
            @stopWaiter()
        else
            try
                title = @model.titleText()
            catch error
                @stopWaiter()
                View.error "Can't parse feed, please check feed address."
                return false

            @model.save { "title": title, "content": "" },
                success: =>
                    @stopWaiter()
                    @renderXml()
                    $target.addClass("feed-open")
                    title = @model.titleText()
                    if title
                        last  = @model.last
                        @model.save { "title": title, "last": last, "content": "" }
                        $allThat.find("a").html title
                        View.log "" + title + " reloaded"
                error: =>
                    @stopWaiter()
                    View.error "Server error occured, feed was not updated."
        false

    refillAddForm: ->
        title = @$el.find(".feed-title")
        url   = title.attr("href")
        tags  = title.attr("data-tags") or ""

        $("form.new-feed .new-feed-url").val(url)
        $("form.new-feed .new-feed-tags").val(tags)

        unless $('.new-feed').is(':visible')
            $('.menu-new').trigger 'click'

    fullRemove: ->
        myTag = @$el.parents(".tag")
        if myTag.find(".feed").length is 1
            myTag.remove()

        @destroy()

        existingLinks = $(".links ." + @feedClass() + ", .link" + @model.cid)
        if existingLinks.length
            existingLinks.remove()

        $(".clone." + @model.cid).remove()

    onDeleteClicked: (evt) ->
        @model.destroy
            success: =>
                @refillAddForm()
                @fullRemove()
                title = @model.titleText()
                if title
                    View.log "" + title + " removed and placed in form"
            error: =>
                View.error "Server error occured, feed was not deleted."
        evt.preventDefault()

        false
