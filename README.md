# Feeds reader application

ZeroFeeds is a RSS feeds reader for CozyCloud that aims to minimize the 
procrastination effect related to reading RSS feeds.


# To do ...

* add filter for links
* add links to resources used
* code review (a lot of cleaning is needed)
** use a model for every "element" (link, tag, ...)
* bug : needs to load feed 2 times before to get updated title : still ?
* bug : first display of a feed cant be deleted : still ?
* bug : first display of a feed with redirection fails
* to finish : store parsed links into db, 
              in order to manage old/new/read feeds in a simplier way
* pb : too many counter reload implies couchdb size to grow
* pb : i dont know how to define a model (server side) with a list for tags
* was looking for atom link in "id", changed it to link ?? need to check why

* to know : some feeds change link params at every update

* note : v1.0 is far from being a good version
* note : i've been lazy doing it well so there is no "tag" model
* note : i wanted to see how client would deal with feed parsing


# Changelog

* v1.5.1
  * fix bug: first installation failed due to a call to old request at server 
  start
* v1.5
  * full UI review
  * change the "all" request for the next data system
  * update vendor librairies versions
  * fixed bug : some feeds require user-agent
  * update vendor librairies versions + review of UI
* v1.4
  * stop to store the feeds content as we dont use it yet ... speed up
  * config update
* v1.3
  * UX improvement
* v1.2
  * change default port (all apps with same port may disturb cozy)
  * use of americano instead of compound
  * can import opml files and feeds from a firefox export of bookmarks file
  * add new elements counters
* v1.1
  * accept gziped feeds
  * try to add "http://" when no protocol is given in a feed url
  * better place to find link for atom feed 
  * update newly added feed
  * prevent to reload a feed already reloading (only for full tag reload)
  * give more space to feeds names
  * try to fix styles for small screens
  * add help panel
  * code cleaning (views)
  * better place to find link for atom feed 
  * fixed bug : send tags array to cozy bookmarks
  * fixed bug : a feed was only in one of its tag
  * fixed bug : send tags array to cozy bookmarks
  * fixed bug : error handling when the feed cant be parsed
  * fixed bug : show only new links parameter wasn't used after reload
  * fixed bug : display links first time a feed is used
* v1.0
  * allow https feeds
  * add an icon to send to twitter
  * open links in new window
  * more explicit icons to add a feed and to display link description
  * remove tag when deleting its last feed
  * send feed to cozy-bookmark
  * new main icon and favicon
  * general UI review
* v0.9
  * allow to refresh all feeds at once (by tag)
  * display new links since last update : testing version, needs improvement, 
* v0.8
  * order feeds by tags
  * use of alertify.js
  * refactoring model
* v0.7
  * manage atom feeds
  * bug solved : display last 10 links (for real ... i hope)
  * bug solved : css classes of feeds with bad characters cant be removed
* v0.6
  * display the content or the description a feed
  * deleting a feed puts it into the new feed form
  * cleaning form after adding a new feed
* v0.5
  * first working version


# About Cozy

This app is suited to be deployed on the Cozy platform. Cozy is the personal
server for everyone. It allows you to install your every day web applications 
easily on your server, a single place you control. This means you can manage 
efficiently your data while protecting your privacy without technical skills.

More informations and hosting services on:
https://cozy.io


# Tools & resources used :

* please, check package.json files
* loader icon: http://en.wikipedia.org/wiki/File:Loading.gif - CC by-sa
