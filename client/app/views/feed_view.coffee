View = require '../lib/view'

module.exports = class FeedView extends View
    className: 'feed'
    tagName: 'div'

    events:
        'click': 'onUpdateClicked'
        'click .icon-delete': 'onDeleteClicked'

    constructor: (@model) ->
        @link_template = require './templates/link'
        super()

    template: ->
        template = require './templates/feed'
        template @getRenderData()

    from: ->
        title = @model.attributes.title
        if title
            title.replace(/[\s!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g,
                          '');
        else
            ""

    renderXml: ->
        $xml = $($.parseXML(@model.attributes.content))
        atom = false
        if $xml.find("feed").length > 0
            atom   = true
            $items = $xml.find("entry").get()
        else
            $items = $xml.find("item").get()
        from = @from()
        
        tmpl   = @link_template
        $.each $items,
            (index, value) ->
                title = $(value).find("title").text()
                if atom
                    url = $(value).find("id").text()
                    description = $(value).find("content").text()
                    if description == ""
                        description = $(value).find("summary").text()
                else
                    url = $(value).find("link").text()
                    description = $(value).find("content\\:encoded").text()
                    if description == ""
                        description = $(value).find("description").text()
                link =
                    "title": title
                    "url": url
                    "from": from
                    "description": description
                $(".links").append(tmpl(link))
                if index >= 9
                    false
        
        $(".links .icon-more").click((evt) ->
            parentLink = $(this).parents(".link:first")
            icon = parentLink.find("button")
            icon.toggleClass("icon-more")
            icon.toggleClass("icon-less")
            parentLink.find(".description").toggle())

    onUpdateClicked: (evt) ->
        from     = @from()
        existing = []
        if from
            existing = $(".links ." + from)

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
        if existing.length
            existing.remove()
            @$el.removeClass("show")
            spinner.stop()
        else
            $xml   = $($.parseXML(@model.attributes.content))
            if $xml.find("feed").length > 0
                $title = $xml.find("feed > title:first").text()
            else
                $title = $xml.find("channel > title:first").text()
            @model.save { "title": $title },
                success: =>
                    @renderXml()
                    @render()
                    @$el.addClass("show")
                    spinner.stop()
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
            error: =>
                alert "Server error occured, feed was not deleted."
        evt.preventDefault()
        false
