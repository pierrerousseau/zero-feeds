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
        "click .count": "setUpdate"
        "click .delete": "onDeleteClicked"

    startWaiter: () ->
        @$el.addClass("loading")


    stopWaiter: () ->
        @$el.removeClass("loading")

    addToTag: (tag) ->
        tmpl = tagTemplate
        tag  = tag or "untagged"

        tagPlace = $ "." + tag
        if tagPlace.length is 0
            tagPlace = $(tmpl({ "name": tag }))
            $("#content .feeds").append tagPlace

        exists = tagPlace.find "." + @model.cid
        if $("." + @model.cid).length
            elem = new FeedView(@model, true).$el
            elem.addClass("clone")
        else
            elem = @$el

        if exists.length
            exists.replaceAll elem
        else
            tagPlace.append elem

    setCount: () ->
        count = @model.count()
        if count
            @$el.find(".count").html "(" + count + ")"
        else
            @$el.find(".count").html ""

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
                    setTimeout _.bind(@setUpdate, @),
                         ((11 + Math.floor(Math.random()*14)) * 60000)
                    @stopWaiter()
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
            alertify.alert "No link found, are you sure this is a feed url ?"
            return
        links.reverse()
        $.each links,
            (index, link) ->
                link.toCozyBookMarks = withCozyBookmarks
                $(".links").prepend($(tmpl(link)))

    onUpdateClicked: (evt, full) ->
        @startWaiter()

        $allThat      = $("." + @model.cid)
        existingLinks = $(".links ." + @feedClass() + ", .link" + @model.cid)
        if existingLinks.length
            existingLinks.remove()
            $allThat.removeClass "show"
            @setCount()
            @stopWaiter()
        else
            try
                title = @model.titleText()
            catch error
                alertify.alert "Can't parse feed, please check feed address." +
                               "no redirection, valid feed, ..."
                @stopWaiter()
                return
            $allThat.addClass "show"
            @model.save { "title": title, "content": "" },
                success: =>
                    @renderXml()
                    title = @model.titleText()
                    last  = @model.last
                    @model.save { "title": title, "last": last, "content": "" }
                    $allThat.find("a").html title
                    alertify.log "" + title + " reloaded"
                    @stopWaiter()
                error: =>
                    alertify.alert "Server error occured, feed was not updated."
                    @stopWaiter()

        evt.preventDefault()
        false

    refillAddForm: ->
        title = @$el.find(".title")
        url   = title.find("a").attr("href")
        tags  = title.find("span").attr("tags") or ""

        $("form.new-feed .url-field").val(url)
        $("form.new-feed .tags-field").val(tags)

        unless $('.new-feed').is(':visible')
            $('.new').trigger 'click'

    fullRemove: ->
        myTag = @$el.parents(".tag")
        if myTag.find(".feed").length is 1
            myTag.remove()

        @destroy()

        $(".clone." + @model.cid).remove()

        title = @$(".title a").html()
        alertify.log "" + title + " removed and placed in form"

    onDeleteClicked: (evt) ->
        @model.destroy
            success: =>
                @refillAddForm()
                @fullRemove()
            error: =>
                alertify.alert "Server error occured, feed was not deleted."
        evt.preventDefault()

        false
