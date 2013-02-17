# Feeds reader application

Follow your favorite sites here !

# To do ...

* for v1.1 : add filter for links
* code review (a lot of cleaning is needed)
* bug : doesnt support https
* bug : needs to load feed 2 times before to get updated title : still ?
* bug : first display of a feed cant be deleted : still ?
* to know : some feeds change link params at everyupdate
* to finish : store parsed links into db, 
              in order to manage old/new/read feeds in a simplier way


# Changelog

* v0.9.5
  * add an icon to send to twitter
* v0.9.4
  * open links in new window
  * more explicit icons to add a feed and to display link description
  * remove tag when deleting its last feed
* v0.9.3
  * UI review
* v0.9.2
  * send feed to cozy-bookmark
* v0.9.1
  * new main icon and favicon
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

