View         = require '../lib/view'
linkTemplate = require './templates/link'
tagTemplate  = require './templates/tag'

module.exports = class FeedView extends View
    className: 'feed'
    tagName: 'div'

    constructor: (@model) ->
        super()

    template: ->
        template = require './templates/feed'
        template @getRenderData()

    startWaiter: (elem) ->
        $(elem).find(".buttons").append("<img " +
                                        " src='images/loader.gif'" +
                                        " class='loader'" +
                                        " alt='loading ...' />")

    stopWaiter: (elem) ->
        $(elem).find(".loader").remove()

    renderXml: ->
        $items = @model.$items()
        tmpl   = linkTemplate
        links  = @model.links()
        links.reverse()

        $.each links,
            (index, link) ->
                linkElem = $(tmpl(link))
                linkElem.find("button").click((evt) ->
                    icon = $(this)
                    icon.toggleClass("icon-more")
                    icon.toggleClass("icon-less")
                    linkElem.find(".description").toggle())
                linkElem.find(".to-cozy-bookmarks").click((evt) ->
                    icon = $(this)
                    ajaxOptions =
                        type: "POST",
                        url: "../../apps/" +
                             link.toCozyBookMarks +
                             "/bookmarks",
                        data: { url: link.url, tags: "cozy-feeds" }
                    $.ajax(ajaxOptions))
                $(".links").prepend(linkElem)

    onUpdateClicked: (evt, full) ->
        that = evt.currentTarget
        allThat = $("." + @model.cid)
        @startWaiter(that)
        existing = $(".links ." + @model.feedClass())
        $(".none").remove()
        if existing.length
            existing.remove()
            $(allThat).removeClass("show")
            @stopWaiter(that)
        else
            title = @model.titleText()
            @model.save { "title": title },
                success: =>
                    @renderXml()
                    @model.attributes.title = @model.titleText()
                    @render()
                    $(allThat).find("a").html(@model.titleText())
                    $(allThat).addClass("show")
                    @stopWaiter(that)
                    alertify.log "" + @$el.find(".title span").html() +
                                 " reloaded"
                    last  = @model.last
                    title = @model.titleText()
                    @model.save { "title": title, "last": last },
                error: =>
                    @stopWaiter(that)
                    alert "Server error occured, feed was not updated."
        evt.preventDefault()
        false

    onDeleteClicked: (evt) ->
        that = evt.currentTarget
        @model.destroy
            success: =>
                title = @$el.find(".title")
                url   = title.find("a").attr("href")
                tags  = title.find("span").attr("title")
                if !tags
                    tags = ""
                $("form.new-feed .url-field").val(url)
                $("form.new-feed .tags-field").val(tags)
                $(".icon-new").click()
                @destroy()
                alertify.log "" + @$el.find(".title span").html() +
                             " removed and placed in form"
            error: =>
                alert "Server error occured, feed was not deleted."
        evt.preventDefault()
        false

    render: ->
        @$el.html @template({})
        @$el.addClass(@model.cid)

        tags = @model.attributes.tags
        if !tags
            tags = ["untagged"]

        tmpl = tagTemplate
        tagNumber = 0
        for tag in tags
            if tag == ""
                tag = "untagged"
            tagPlace = $("." + tag)
            if tagPlace.length == 0
                tagPlace = $(tmpl({ "name": tag }))
                $("#content .feeds").append(tagPlace)

            toDisplay = @$el.clone(true, true)
            that = @
            toDisplay.on("click", "",
                         (evt) -> that.onUpdateClicked(evt))
            toDisplay.on("click", ".icon-delete",
                         (evt) -> that.onDeleteClicked(evt))

            exists = tagPlace.find("." + @model.cid)
            if exists.length
                exists.replaceAll(toDisplay)
            else
                tagPlace.append(toDisplay)

            tagNumber++
            @$el.hide()
        @

    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        $("." + @model.cid).remove()
        @remove()
        Backbone.View::remove.call @
