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

    onUpdateClicked: (evt) ->
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
        spinner.spin(@el)
        
        existing = $(".links ." + @model.feedClass())
        if existing.length
            existing.remove()
            @$el.removeClass("show")
            spinner.stop()
        else
            title = @model.titleText()
            @model.save { "title": title },
                success: =>
                    @renderXml()
                    @model.attributes.title = @model.titleText()
                    @render()
                    @$el.addClass("show")
                    spinner.stop()
                    alertify.log "" + @$el.find(".title span").html() + 
                                 " reloaded"
                error: =>
                    spinner.stop()
                    alert "Server error occured, feed was not deleted."
        evt.preventDefault()

    onDeleteClicked: (evt) ->
        @model.destroy
            success: =>
                url = @$el.find(".title a").attr("href")
                $("form.new-feed .url-field").val(url)
                @destroy()
                alertify.log "" + @$el.find(".title span").html() + 
                             " removed and placed in form"
            error: =>
                alert "Server error occured, feed was not deleted."
        evt.preventDefault()
        false
