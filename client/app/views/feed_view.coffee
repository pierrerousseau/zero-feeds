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
            title.replace(/\s/g, "")
        else
            ""

    renderXml: ->
        $xml  = $($.parseXML(@model.attributes.content))
        title = $xml.find("channel > title:first").text()
        @$el.find(".title a").html(title)
        $items = $xml.find("item").get()
        $items.reverse()
        from   = @from()
        tmpl   = @link_template
        $.each $items,
            (index, value) ->
                title = $(value).find("title").text()
                url   = $(value).find("link").text()
                link = { "title": title, "url": url, "from": from }
                $(".links").prepend(tmpl(link))
                if index >= 9
                    false

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
            $title = $xml.find("channel > title:first").text()
            @model.save { "title": $title },
                success: =>
                    @renderXml()
                    @render()
                    console.log(@$el)
                    @$el.addClass("show")
                    spinner.stop()
                error: =>
                    spinner.stop()
                    alert "Server error occured, feed was not deleted."
        evt.preventDefault()

    onDeleteClicked: (evt) ->
        @model.destroy
            success: =>
                @destroy()
            error: =>
                alert "Server error occured, feed was not deleted."
        evt.preventDefault()
        false
