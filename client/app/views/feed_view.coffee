View = require '../lib/view'
linkTemplate = require './templates/link'

module.exports = class FeedView extends View
    className: 'feed'
    tagName: 'div'

    events:
        'click': 'onUpdateClicked'
        'click .icon-delete': 'onDeleteClicked'

    constructor: (@model) ->
        super()

    template: ->
        template = require './templates/feed'
        template @getRenderData()

    renderXml: ->
        $items = @model.$items()
        tmpl   = linkTemplate
        links  = @model.links()
        links.reverse()

        $.each links,
            (index, link) ->
                link = $(tmpl(link))
                link.find("button").click((evt) ->
                    icon = $(this)
                    icon.toggleClass("icon-more")
                    icon.toggleClass("icon-less")
                    link.find(".description").toggle())
                $(".links").prepend(link)

    onUpdateClicked: (evt, that) ->
        allThat = $("." + @model.cid)
        spinner = new Spinner
            "lines": 13
            "length": 4
            "width": 4
            "radius": 6
            "corners": 1
            "rotate": 0
            "color": '#27aaf2'
            "speed": 1
            "trail": 60
            "shadow": true
            "hwaccel": false
            "className": 'spinner'
            "top": 'auto'
            "left": 'auto'
        spinner.spin(that)

        existing = $(".links ." + @model.feedClass())
        if existing.length
            existing.remove()
            $(allThat).removeClass("show")
            spinner.stop()
        else
            title = @model.titleText()
            @model.save { "title": title },
                success: =>
                    @renderXml()
                    @model.attributes.title = @model.titleText()
                    @render()
                    $(allThat).find("a").html(@model.titleText())
                    $(allThat).addClass("show")
                    spinner.stop()
                    alertify.log "" + @$el.find(".title span").html() +
                                 " reloaded"
                error: =>
                    spinner.stop()
                    alert "Server error occured, feed was not deleted."
        evt.preventDefault()

    onDeleteClicked: (evt, that) ->
        @model.destroy
            success: =>
                title = @$el.find(".title")
                url   = title.find("a").attr("href")
                tags  = title.find("span").attr("title")
                if !tags
                    tags = ""
                $("form.new-feed .url-field").val(url)
                $("form.new-feed .tags-field").val(tags)
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

        tagNumber = 0
        for tag in tags
            if tag == ""
                tag = "untagged"
            tagDiv = $("." + tag)
            if tagDiv.length == 0
                tagDiv = $('<div class="' + tag + '">' + tag + '</div>')
                $("#content .feeds").append(tagDiv)

            toDisplay = @$el.clone(true, true)
            toDisplay.show()
            that = @
            toDisplay.on("click", "", (evt) -> that.onUpdateClicked(evt, this))
            toDisplay.on("click", 
                         ".icon-delete", 
                         (evt) -> that.onDeleteClicked(evt, this))

            exists = tagDiv.find("." + @model.cid)
            if exists.length
                exists.replaceAll(toDisplay)
            else
                tagDiv.append(toDisplay)

            tagNumber++
            @$el.hide()

        @
    
    destroy: ->
        @undelegateEvents()
        @$el.removeData().unbind()
        $("." + @model.cid).remove()
        @remove()
        Backbone.View::remove.call @
