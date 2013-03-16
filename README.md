# Feeds reader application

Follow your favorite sites here !

# To do ...

* add filter for links
* add import function
* note : v1.0 is far from being a good version
* code review (a lot of cleaning is needed)
* bug : needs to load feed 2 times before to get updated title : still ?
* bug : first display of a feed cant be deleted : still ?
* to know : some feeds change link params at everyupdate
* to finish : store parsed links into db, 
              in order to manage old/new/read feeds in a simplier way


# Changelog

* v1.0.1
  * add help panel
  * try to add "http://" when no protocol is given in a feed url
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
http://cozycloud.cc


# Tools & resources used :

* please, check package.json files
* main icon from IconTexto (http://icontexto.blogspot.fr/ - CC by-nc-sa)
* other icons from
  * Icojam (http://www.icojam.com/ - free for use)
  * Jonas Rask (http://jonasraskdesign.com/ - free for commercial use)
  * http://en.wikipedia.org/wiki/File:Loading.gif - CC by-sa
* alertify.js (http://fabien-d.github.com/alertify.js/ - MIT)

