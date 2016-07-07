(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("collections/feed_collection", function(exports, require, module) {
var Feed, FeedCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Feed = require('../models/feed');

module.exports = FeedCollection = (function(superClass) {
  extend(FeedCollection, superClass);

  FeedCollection.prototype.model = Feed;

  FeedCollection.prototype.url = 'feeds';

  function FeedCollection(view) {
    this.view = view;
    FeedCollection.__super__.constructor.call(this);
    this.bind("add", this.view.renderOne);
    this.bind("reset", this.view.renderAll);
  }

  return FeedCollection;

})(Backbone.Collection);
});

;require.register("collections/param_collection", function(exports, require, module) {
var Param, ParamCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Param = require('../models/param');

module.exports = ParamCollection = (function(superClass) {
  extend(ParamCollection, superClass);

  ParamCollection.prototype.model = Param;

  ParamCollection.prototype.url = 'params';

  function ParamCollection(view) {
    this.view = view;
    ParamCollection.__super__.constructor.call(this);
    this.bind("add", this.view.renderOne);
    this.bind("reset", this.view.renderAll);
  }

  return ParamCollection;

})(Backbone.Collection);
});

;require.register("initialize", function(exports, require, module) {
var initializeJQueryExtensions, initializeLocale;

if (this.CozyApp == null) {
  this.CozyApp = {};
}

if (CozyApp.Routers == null) {
  CozyApp.Routers = {};
}

if (CozyApp.Views == null) {
  CozyApp.Views = {};
}

if (CozyApp.Models == null) {
  CozyApp.Models = {};
}

if (CozyApp.Collections == null) {
  CozyApp.Collections = {};
}

$(function() {
  var locale;
  require('../lib/app_helpers');
  initializeJQueryExtensions();
  locale = 'en';
  return $.ajax('cozy-locale.json', {
    success: function(data) {
      locale = data.locale;
      return initializeLocale(locale);
    },
    error: function() {
      return initializeLocale(locale);
    }
  });
});

initializeJQueryExtensions = function() {
  return $.fn.spin = function(opts, color) {
    var presets;
    presets = {
      tiny: {
        lines: 8,
        length: 1,
        width: 1,
        radius: 3
      },
      small: {
        lines: 8,
        length: 1,
        width: 2,
        radius: 5
      },
      large: {
        lines: 10,
        length: 8,
        width: 4,
        radius: 8
      }
    };
    if (Spinner) {
      return this.each(function() {
        var $this, spinner;
        $this = $(this);
        spinner = $this.data("spinner");
        if (spinner != null) {
          spinner.stop();
          return $this.data("spinner", null);
        } else if (opts !== false) {
          if (typeof opts === "string") {
            opts = presets[opts];
          }
          if (opts == null) {
            opts = {};
          }
          opts.color = $this.css('color');
          if (color) {
            opts.color = color;
          }
          console.log(opts.color);
          spinner = new Spinner(opts);
          spinner.spin(this);
          return $this.data("spinner", spinner);
        }
      });
    } else {
      console.log("Spinner class not available.");
      return null;
    }
  };
};

initializeLocale = function(locale) {
  var AppView, err, error, locales, polyglot;
  locales = {};
  try {
    locales = require('locales/' + locale);
  } catch (error) {
    err = error;
    locales = require('locales/en');
  }
  polyglot = new Polyglot();
  polyglot.extend(locales);
  window.t = polyglot.t.bind(polyglot);
  CozyApp.Views.appView = new (AppView = require('views/app_view'));
  CozyApp.Views.appView.render();
  return Backbone.history.start({
    pushState: true
  });
};
});

;require.register("lib/app_helpers", function(exports, require, module) {
(function() {
  return (function() {
    var console, dummy, method, methods, results;
    console = window.console = window.console || {};
    method = void 0;
    dummy = function() {};
    methods = 'assert,count,debug,dir,dirxml,error,exception, group,groupCollapsed,groupEnd,info,log,markTimeline, profile,profileEnd,time,timeEnd,trace,warn'.split(',');
    results = [];
    while (method = methods.pop()) {
      results.push(console[method] = console[method] || dummy);
    }
    return results;
  })();
})();
});

;require.register("lib/view", function(exports, require, module) {
var View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = View = (function(superClass) {
  extend(View, superClass);

  function View() {
    return View.__super__.constructor.apply(this, arguments);
  }

  View.prototype.tagName = 'section';

  View.prototype.template = function() {};

  View.prototype.initialize = function() {
    return this.render();
  };

  View.prototype.getRenderData = function() {
    var ref;
    return {
      model: (ref = this.model) != null ? ref.toJSON() : void 0
    };
  };

  View.prototype.render = function() {
    this.beforeRender();
    this.$el.html(this.template({}));
    this.afterRender();
    return this;
  };

  View.prototype.beforeRender = function() {};

  View.prototype.afterRender = function() {};

  View.prototype.destroy = function() {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
    return Backbone.View.prototype.remove.call(this);
  };

  View.confirm = function(text, cb) {
    return $(function() {
      return (new PNotify({
        "text": text,
        "icon": false,
        "hide": false,
        "type": "info",
        "confirm": {
          "confirm": true
        },
        "buttons": {
          "sticker": false
        },
        "width": "40%"
      })).get().on("pnotify.confirm", function() {
        return cb();
      });
    });
  };

  View.error = function(text) {
    return $(function() {
      return new PNotify({
        "text": text,
        "icon": false,
        "hide": false,
        "type": "error",
        "buttons": {
          "sticker": false
        }
      });
    });
  };

  View.log = function(text) {
    return $(function() {
      return new PNotify({
        "text": text,
        "icon": false,
        "opacity": .8,
        "delay": 2000,
        "buttons": {
          "sticker": false
        }
      });
    });
  };

  return View;

})(Backbone.View);
});

;require.register("lib/view_collection", function(exports, require, module) {
var View, ViewCollection, methods,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('./view');

ViewCollection = (function(superClass) {
  extend(ViewCollection, superClass);

  function ViewCollection() {
    this.renderAll = bind(this.renderAll, this);
    this.renderOne = bind(this.renderOne, this);
    return ViewCollection.__super__.constructor.apply(this, arguments);
  }

  ViewCollection.prototype.collection = new Backbone.Collection();

  ViewCollection.prototype.view = new View();

  ViewCollection.prototype.views = [];

  ViewCollection.prototype.length = function() {
    return this.views.length;
  };

  ViewCollection.prototype.add = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      if (!this.get(view.cid)) {
        this.views.push(view);
        if (!options.silent) {
          this.trigger('add', view, this);
        }
      }
    }
    return this;
  };

  ViewCollection.prototype.get = function(cid) {
    return this.find(function(view) {
      return view.cid === cid;
    }) || null;
  };

  ViewCollection.prototype.remove = function(views, options) {
    var i, len, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    for (i = 0, len = views.length; i < len; i++) {
      view = views[i];
      this.destroy(view);
      if (!options.silent) {
        this.trigger('remove', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.destroy = function(view, options) {
    var _views;
    if (view == null) {
      view = this;
    }
    if (options == null) {
      options = {};
    }
    _views = this.filter(_view)(function() {
      return view.cid !== _view.cid;
    });
    this.views = _views;
    view.undelegateEvents();
    view.$el.removeData().unbind();
    view.remove();
    Backbone.View.prototype.remove.call(view);
    if (!options.silent) {
      this.trigger('remove', view, this);
    }
    return this;
  };

  ViewCollection.prototype.reset = function(views, options) {
    var i, j, len, len1, ref, view;
    if (options == null) {
      options = {};
    }
    views = _.isArray(views) ? views.slice() : [views];
    ref = this.views;
    for (i = 0, len = ref.length; i < len; i++) {
      view = ref[i];
      this.destroy(view, options);
    }
    if (views.length !== 0) {
      for (j = 0, len1 = views.length; j < len1; j++) {
        view = views[j];
        this.add(view, options);
      }
      if (!options.silent) {
        this.trigger('reset', view, this);
      }
    }
    return this;
  };

  ViewCollection.prototype.renderOne = function(model) {
    var view;
    view = new this.view(model);
    this.add(view);
    return this;
  };

  ViewCollection.prototype.renderAll = function() {
    this.collection.each(this.renderOne);
    return this;
  };

  return ViewCollection;

})(View);

methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find', 'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex', 'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf', 'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

_.each(methods, function(method) {
  return ViewCollection.prototype[method] = function() {
    return _[method].apply(_, [this.views].concat(_.toArray(arguments)));
  };
});

module.exports = ViewCollection;
});

;require.register("locales/en", function(exports, require, module) {
module.exports = {
    "add feeds": "Add feeds",
    "comming soon": "Comming soon...",
    "error cannot parse feed": "Can't parse feed, please check feed address.",
    "error file cannot be imported": "This file cannot be imported",
    "error no link found": "No link found, are you sure that the url is correct ?",
    "error server error feed not added": "Server error occured, feed was not added",
    "error server error feed not deleted": "Server error occured, feed was not deleted.",
    "error url field required": "Url field is required",
    "feed reloaded": "reloaded",
    "feed removed placed in form": "removed and placed in form",
    "help": "Help",
    "help add an issue": "add an issue",
    "help and help me to help you": "and help me to help you",
    "help difference from others reader": "In usual feed readers, the links are availables as long as they are provided by the websites, so you will first read what matters, then what looks interesing, then this stuff that is maybe the thing to read, then what is left, oh it's time to go to lunch ! No. I do not like this way of procrastination, so do not expect zero-feeds to help you to do that.",
    "help don't reload all feeds": "I don't want to reload all the feeds of a tag.",
    "help don't reload all feeds answer": "Like me. So, just click on the tag name in the left panel, all feeds will be displayed, then click on the feed title you want to reload.",
    "help free softwares": "I want to use only free softwares.",
    "help how do i start": "How do I start?",
    "help how do i start answer": "Probably by adding a feed (check the tabs, I'm sure you can find where to do that).",
    "help how does it work": "How does it work?",
    "help how to add add feed": "I'm not sure, how to add a feed ?",
    "help how to add add feed answer": "Just click on the top \"Add Feeds\" button, fill the url and tags fields and click on the \"Add Feed\" button right next to the tags field (or hit the enter key in one of the fields). The tags and the feed url should appear in the left panel.",
    "help how to edit feed": "I want to change the tags of a feed, or I mistyped the url, how can I edit my feed ?",
    "help how to edit feed answer": "Pass the mouse on the feed title and click on cross on left of the feed, don't worry, your feed will be removed, but the \"Add Feed\" form will be filled with its url and tags. Change what is wrong and add the feed again.",
    "help idea behind": "The idea behind zero-feeds is that if you do not read a link when you discover it, most of the time, it means that you are not so much interested in it (it's an \"opinionated\" feeds reader). So read it now or forget it.",
    "help it still doesn't work": "It still doesn't work !",
    "help licence": "I'm not sure what licence I can use for a cozycloud app but you can consider my code under",
    "help links disappeared": "The first time I clicked on a feed, the links of this feed have been displayed, now I clicked several times and there is no more links !",
    "help links disappeared answer": "You just need to click once. In fact, \"reloading\" a feed aims to display the new links of this feed since the last time you did reload it. So if you see nothing, it means that there is no new link to help you to procrastinate.",
    "help me too": "Me too",
    "help news of the year": "Will you miss the news of the year?",
    "help news of the year answer": "No, if you did not click on it, you will hear about it from others. So what are you afraid to miss ? A good link ? Yes probably, but do not worry, there will be another good link tomorow.",
    "help only beginning of feed url": "I just see the beginning of the url of my feed, I feel unsatisfied.",
    "help only beginning of feed url answer": "Now click on it. The title of this feed should replace its url and the link of this feed should be displayed.",
    "help please": "Please",
    "help report a bug": "Report a bug",
    "help retrieve old links": "I didn't visit all the links of a feed and I \"reloaded\" it, are the \"old\" links lost ?",
    "help retrieve old links answer": "No, click on the \"Settings\" button at the top and check the \"Show new and old links\" checkbox, they should appear.",
    "help scale 6000 feeds": "Does it scale for my 6000 feeds?",
    "help scale 6000 feeds answer": "Seriously ? Reduce your amount of sites you follow, you have better to do today than reading all of them.",
    "help tool presentation": "This is a tool to follow your rss/atom feeds without to much procrastinating.",
    "help what are tags": "What are these \"tags\" ?",
    "help what are tags answer": "They will be used to classify your feeds in the left panel. A click on a tag name will display all feeds tagged with it.",
    "help what is quickmark app": "In this \"Settings\" panel, there is a field called \"Use Quickmarks app to save links\", what is it ?",
    "help what is quickmark app answer": "You are curious, isn't it ? I like you. So, install the Quickmarks app that you can find in the Cozy Store. Then you should see a \"send to quickmarks\" button on the left of the feed links, click on it, and this link will be added to your bookmarks in the quickmarks app. This is a perfect world, but this feature is not implemented yet",
    "history": "History",
    "import export": "Import/Export",
    "link open and read now": "Open and read now",
    "link send to twitter": "Send to Twitter",
    "link share": "Share",
    "links": "Links",
    "panelAddFeeds add a feed": "Add a feed",
    "panelAddFeeds add feed": "Add feed",
    "panelAddFeeds feed url": "Feed URL",
    "panelAddFeeds science diy": "science, diy",
    "panelAddFeeds tags separated by": "Tags (separated by \", \")",
    "panelImportExport import": "Import",
    "panelImportExport description import": "Import opml rss file or html bookmarks file containing feeds and exported from firefox or chrome",
    "panelImportExport export": "Export",
    "panelLinks new articles": "new articles from your favorite feeds",
    "panelTips any question": "Any question ?",
    "panelTips change colors": "Colors are too dark? There is a parameter in the settings panel to make all clear.",
    "panelTips check by category": "Choose a category, and check all new interesting links in the category before doing something else.",
    "panelTips check environment before starting": "Make sure that you are in a quiet place with enough time before starting to check your feeds.",
    "panelTips check feeds once": "Check your feeds only once a day.",
    "panelTips check in evening": "Better check your feeds in the evening, before going to bed.",
    "panelTips check info before sharing": "Do not share a new information found in your feeds before you checked it elsewhere.",
    "panelTips contact author": "Something annoying with zero-feeds? Contact the author and solve this together.",
    "panelTips display old links": "Zero-Feeds displays only the new links from your feeds, if you still want them, there is a parameter to change in the settings panel",
    "panelTips don't read all internet": "Do not follow dozen of sites, you have better to do today than reading all the internet.",
    "panelTips follow or forget": "Follow a new link now or forget it.",
    "panelTips give star on github": "Give a star to zero-feeds on github to put a smile on the author face.",
    "panelTips look poulp or help": "When you are not sure about something, look at the poulp, or visit the help section.",
    "panelTips modify feed": "To modify a feed, remove it, it will be placed in the add a feed form, then change it and add the feed again.",
    "panelTips no feed during holidays": "Do not follow your feeds during your holidays.",
    "panelTips no feed during weekend": "Do not follow your feeds during the weekend.",
    "panelTips no new link": "No new link ? Good! You can start what matters now.",
    "panelTips open interesting feeds": "Visit all your feeds, open the interesting links in new tabs, close zero-feeds, start reading.",
    "panelTips share only interesting link": "Share a link only you can answer to why it is an interesting link.",
    "panelTips take a break": "After reading new links every day for free months, take a break.",
    "panelTips tip of the day": "Tip of the day",
    "panelTips visit forum": "Visit the thread about zero-feeds in the cozy forum.",
    "panelTips visit help": "Visit the help section to find out how zero-feeds works.",
    "panelTipsAddFeed follow new site": "Follow a new site ?",
    "panelTipsAddFeed find rss/atom link": "On your favorite site find the \"rss/atom\" link.",
    "panelTipsAddFeed fill url and tag": "Then, fill the url field with this link and the tag field with the categories that you want to associtate to this feed.",
    "panelTipsAddFeed add feed": "Then click on the \"Add Feed\" button right next to the tags field (or hit the enter key in one of the fields).",
    "panelTipsAddFeed tag and feed in left panel": "The tags and the feed url should appear in the left panel.",
    "panelTipsSettings old links": "Old links",
    "panelTipsSettings old links description": "I call \"old\" links the links that are still in the rss feed but that have been displayed before.",
    "panelTipsSettings old links default behaviour": "By default, they are not displayed anymore following the \"if you did not read it first time it does not interest you so much\" rule.",
    "panelTipsSettings show old links": "Check the \"Show new and old links\" parameter if you want to procrastinate or if a wrong click removed all links before you read them.",
    "panelWelcome add your first feed": "Add your first feed",
    "panelWelcome import opml file": "Import a .opml file",
    "panelWelcome presentation": "This application is a RSS/Atom feeds reader designed to minimise the time lost reading them",
    "panelWelcome start now": "Start now!",
    "panelWelcome welcome to zero feeds": "Welcome to zero-feeds!",
    "settings": "Settings",
    "settings use quickmarks": "Use the Quickmarks app to save links",
    "settings use twitter": "Use twitter to share links",
    "settings show new and old links": "Show new and old links",
    "settings use light colors": "Use light colors for the interface"
}

});

;require.register("locales/fr", function(exports, require, module) {
module.exports = {
    "add feeds": "Ajouter des flux",
    "comming soon": "Bientôt...",
    "error cannot parse feed": "Impossible d'analyser le flux, veuillez vérifier l'adresse.",
    "error file cannot be imported": "Ce fichier ne peut pas être importé",
    "error no link found": "Aucun lien trouvé, êtes-vous sûr que l'url est correcte ?",
    "error server error feed not added": "Erreur de serveur, le flux n'a pas été ajouté.",
    "error server error feed not deleted": "Erreur de serveur, le flux n'a pas été supprimé.",
    "error url field required": "Le champ url est requis",
    "feed reloaded": "rechargé",
    "feed removed placed in form": "supprimé et placé dans le formulaire",
    "help": "Aide",
    "help add an issue": "ajoutez une issue",
    "help and help me to help you": "et aidez-moi à vous aider",
    "help difference from others reader": "Dans les lecteurs de flux classiques, les liens sont disponibles aussi longtemps qu'ils sont fournis par les sites web. Vous allez donc lire en premier ce qui est important, ensuite ce qui a l'air intéressant, puis ce truc qui est peut-être la chose à lire, et qu'est-ce qui reste ? Oh, il est l'heure d'aller manger ! Non. Je n'aime pas cette façon de procrastiner, donc ne vous attendez pas à ce que zero-feeds vous aide à faire ça.",
    "help don't reload all feeds": "Je ne veux pas recharger tous les flux d'un tag.",
    "help don't reload all feeds answer": "Comme moi. Cliquez simplement sur le nom du tag dans le panneau gauche, tous les flux seront affichés, cliquez alors sur le titre du flux que vous voulez recharger.",
    "help free softwares": "Je ne veux utiliser que des logiciels libres.",
    "help how do i start": "Comment puis-je commencer ?",
    "help how do i start answer": "Probablement en ajoutant un flux (verifiez les onglets, je suis sûr que vous pouvez trouver où faire ça).",
    "help how does it work": "Comment est-ce que ça fonctionne ?",
    "help how to add add feed": "Je ne suis pas sûr, comment ajouter un flux ?",
    "help how to add add feed answer": "Cliquez simplement sur le bouton du haut \"Ajouter des flux\", remplissez les champs url et tags et cliquez sur bouton \"Ajouter le flux\" à droite à côté du champ tags (ou appuyez sur la touche entrée dans l'un des champs). Les tags l'url du flux devraient apparaître dans le panneau gauche.",
    "help how to edit feed": "Je veux change les tags d'un flux, ou j'ai mal écrit l'url, comment puis-je éditer mon flux ?",
    "help how to edit feed answer": "Passez la souris sur le titre du flux et cliquez sur la croix à gauche du flux. Ne vous inquiétez pas, votre flux sera supprimé, mais le formulaire \"Ajouter un flux\" sera pré-rempli avec son url et ses tags. Changez ce qui ne va pas et ajoutez à nouveau le flux.",
    "help idea behind": "L'idée derrière zero-feeds est que si vous ne lisez pas un lien quand vous le découvrez, la plupart du temps, cela signifie que ça ne vous intéresse pas tellement (il en découle des contraintes qui sont voulues et qui peuvent ne pas correspondre à votre manière de fonctionner). Donc lisez-le maintenant ou oubliez-le.",
    "help it still doesn't work": "Ça ne fonctionne toujours pas !",
    "help licence": "Je ne suis pas sûr de la licence que je peux utiliser pour une app cozycloud mais vous pouvez considérer mon code sous",
    "help links disappeared": "La première fois que j'ai cliqué sur un flux, les liens de ce flux ont été affichés. Maintenant, j'ai cliqué plusieurs fois et il n'y a plus de lien !",
    "help links disappeared answer": "Vous n'avez besoin de cliquer qu'une seule fois. En fait, \"recharger\" un flux vise à afficher les nouveaux liens de ce flux depuis la dernière fois que vous l'avez rechargé. Donc si vous ne voyez rien, ça signifie qu'il n'y a pas de nouveaux liens pour vous aider à procrastiner.",
    "help me too": "Moi aussi",
    "help news of the year": "Allez-vous rater la news de l'année ?",
    "help news of the year answer": "Non, si vous ne cliquez pas dessus, vous en entendrez parler dans les autres. Donc qu'est-ce que vous avez peur de rater ? Un bon lien ? Oui probablement, mais ne vous inquiétez pas, il y aura un autre bon lien demain.",
    "help only beginning of feed url": "Je ne vois que le début de l'url de mon flux, je ne suis pas satisfait.",
    "help only beginning of feed url answer": "Maintenant cliqez dessus. Le titre de ce flux devrait remplacer son url et le lien de ce flux devrait être affiché.",
    "help please": "S'il vous plaît",
    "help report a bug": "Signaler un bug",
    "help retrieve old links": "Je n'ai pas visité tous les liens d'un flux et je l'ai rechargé, les \"vieux\" liens sont-ils perdus ?",
    "help retrieve old links answer": "Non. Cliquez sur le bouton \"Paramètres\" en haut et cochez la case \"Afficher les nouveaux et les vieux liens\", ils devraient apparaitre.",
    "help scale 6000 feeds": "Est-il adapté pour mes 6000 flux ?",
    "help scale 6000 feeds answer": "Sérieusement ? Réduisez le nombre de sites que vous suivez, vous avez mieux à faire aujourd'hui que de tous les lire.",
    "help tool presentation": "C'est un outil pour suivre vos flux rss/atom sans trop de procrastination.",
    "help what are tags": "Que sont ces \"tags\" ?",
    "help what are tags answer": "Ils vont être utilisés pour classer vos flux dans le panneau gauche. Un clic sur le nom d'un tag affichera tous les flux taggés avec.",
    "help what is quickmark app": "Dans le panneau \"Paramètres\", il y a un champ intitulé \"Utiliser l'app Quickmarks pour sauvegarder les liens\", qu'est-ce que c'est ?",
    "help what is quickmark app answer": "Vous êtes curieux, n'est-ce pas ? Je vous aime bien. Donc, installez l'app Quickmarks que vous pouvez trouver sur le Cozy Store. Vous devriez alors voir un bouton \"envoyer vers Quickmarks\" à gauche du lien du flux. Cliquez dessus et le lien sera ajouté à vos marque-pages dans l'app Quickmarks. C'est un monde parfait, mais cette fonctionnalité n'a pas encore été implémentée.",
    "history": "Historique",
    "import export": "Import/Export",
    "link open and read now": "Ouvrir et lire maintenant",
    "link send to twitter": "Envoyer sur Twitter",
    "link share": "Partager",
    "links": "Liens",
    "panelAddFeeds add a feed": "Ajouter un flux",
    "panelAddFeeds add feed": "Ajouter le flux",
    "panelAddFeeds feed url": "URL du flux",
    "panelAddFeeds science diy": "science, diy",
    "panelAddFeeds tags separated by": "Tags (séparés par \", \")",
    "panelImportExport import": "Import",
    "panelImportExport description import": "Importer un fichier rss opml ou un fichier de marque-pages html contenant des flux exporté depuis firefox ou chrome",
    "panelImportExport export": "Export",
    "panelLinks new articles": "Nouveaux articles depuis vos flux favoris",
    "panelTips any question": "Des questions ?",
    "panelTips change colors": "Les couleurs sont trop sombres ? Il y a un paramètre dans le panneau paramètres pour rendre le tout plus clair.",
    "panelTips check by category": "Choisissez une catégorie, et vérifiez tous les nouveaux liens intéressants à l'intérieur avant de faire quelque chose d'autre.",
    "panelTips check environment before starting": "Assurez-vous d'être dans un endroit calme avec assez de temps avant de commencer à consulter vos flux.",
    "panelTips check feeds once": "Consultez vos flux seulement une fois par jour.",
    "panelTips check in evening": "Consultez plutôt vos flux dans la soirée, avant d'aller au lit.",
    "panelTips check info before sharing": "Partagez une nouvelle information découverte dans vos flux uniquement après l'avoir vérifiée ailleurs.",
    "panelTips contact author": "Quelque chose de gênant avec zero-feeds ? Contactez l'auteur et résolvez ça ensemble.",
    "panelTips display old links": "Zero-Feeds affiche uniquement les nouveaux liens de vos flux, si vous les voulez toujours, il y a un paramètre à changer de le panneau de paramètres.",
    "panelTips don't read all internet": "Ne suivez pas une douzaine de sites, vous avez mieux à faire aujourd'hui que de lire tout internet.",
    "panelTips follow or forget": "Suivez un nouveau lien maintenant ou oubliez-le.",
    "panelTips give star on github": "Donnez une étoile à zero-feeds sur Github pour afficher un sourire sur le visage de l'auteur.",
    "panelTips look poulp or help": "Quand vous n'êtes pas sûr à propos de quelque chose, regardez le poulpe, ou visitez la section aide.",
    "panelTips modify feed": "Pour modifier un flux, supprimez-le, il sera placé dans le formulaire d'ajout de flux. Ensuite, modifiez-le ajoutez le flux à nouveau.",
    "panelTips no feed during holidays": "Ne suivez pas vos flux pendant vos vacances.",
    "panelTips no feed during weekend": "Ne suivez pas vos flux pendant le week-end.",
    "panelTips no new link": "Pas de nouveau lien ? Bien ! Vous pouvez commencer ce qui est important maintenant.",
    "panelTips open interesting feeds": "Regardez tous vos flux, ouvrez les liens intéressants dans de nouveaux onglets, fermez zero-feeds, commencez à lire.",
    "panelTips share only interesting link": "Partagez un lien uniquement si vous pouvez répondre à la question \"pourquoi ce lien est intéressant ?\".",
    "panelTips take a break": "Après avoir lu de nouveaux liens tous les jours pendant plusieurs mois, prenez une pause.",
    "panelTips tip of the day": "Astuce du jour",
    "panelTips visit forum": "Visitez le sujet sur zero-feeds dans le forum de cozy cloud.",
    "panelTips visit help": "Visitez la section aide pour trouver comment zero-feeds fonctionne.",
    "panelTipsAddFeed follow new site": "Suivre un nouveau site ?",
    "panelTipsAddFeed find rss/atom link": "Sur votre site favori, trouvez le lien \"rss/atom\".",
    "panelTipsAddFeed fill url and tag": "Ensuite, remplissez le champ url avec ce lien et le champ tag avec la catégorie que vous voulez associer à ce flux.",
    "panelTipsAddFeed add feed": "Cliquez alors sur le bouton \"Ajouter le flux\" à droite à côté du champ tags (ou appuyez sur la touche entrée dans l'un des champs).",
    "panelTipsAddFeed tag and feed in left panel": "Les tags and l'url du flux devraient apparaitre dans le panneau gauche.",
    "panelTipsSettings old links": "Vieux liens",
    "panelTipsSettings old links description": "J'appelle \"vieux\" liens les liens qui sont toujours dans le flux rss mais qui ont déjà été affichés auparavant.",
    "panelTipsSettings old links default behaviour": "Par défaut, ils ne sont plus affichés suivant la règle \"si vous ne l'avez pas lu la première fois, ça ne vous intéresse pas tant que ça\".",
    "panelTipsSettings show old links": "Cochez le paramètre \"Afficher les nouveaux et les vieux liens\" si vous voulez procrastiner ou si un mauvais clic a supprimé tous les liens avant que vous les lisiez.",
    "panelWelcome add your first feed": "Ajoutez votre premier flux",
    "panelWelcome import opml file": "Importez un fichier .opml",
    "panelWelcome presentation": "Cette application est un lecteur de flux RSS/Atom conçu pour minimiser le temps perdu en les lisant.",
    "panelWelcome start now": "Démarrez maintenant !",
    "panelWelcome welcome to zero feeds": "Bienvenue dans zero-feeds!",
    "settings": "Paramètres",
    "settings use quickmarks": "Utiliser l'app Quickmarks pour sauvegarder les liens",
    "settings use twitter": "Utiliser Twitter pour partager les liens",
    "settings show new and old links": "Afficher les nouveaux et les vieux liens",
    "settings use light colors": "Utiliser des couleurs claires pour l'interface"
}

});

;require.register("models/feed", function(exports, require, module) {
var Feed,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Feed = (function(superClass) {
  extend(Feed, superClass);

  function Feed() {
    return Feed.__super__.constructor.apply(this, arguments);
  }

  Feed.prototype.urlRoot = 'feeds';

  Feed.prototype.titleText = function() {
    var title;
    if (this.attributes.title) {
      title = this.attributes.title;
    } else {
      if (this.isAtom()) {
        title = this.toXml().find("feed > title:first").text();
      } else {
        title = this.toXml().find("channel > title:first").text();
      }
    }
    return $.trim(title);
  };

  Feed.prototype.toXml = function() {
    if (this.changed || !this._xml) {
      this._$xml = $($.parseXML(this.attributes.content));
    }
    return this._$xml;
  };

  Feed.prototype.isAtom = function() {
    return this.toXml().find("feed").length > 0;
  };

  Feed.prototype.$items = function() {
    if (this.isAtom()) {
      return this.toXml().find("entry").get();
    } else {
      return this.toXml().find("item").get();
    }
  };

  Feed.prototype.cleanGoogle = function(url) {
    if (url.startsWith("http://news.google.com") || url.startsWith("https://news.google.com")) {
      url = url.split("url=")[1];
    }
    return url;
  };

  Feed.prototype.count = function() {
    var items, last, nbNew;
    last = this.attributes.last;
    items = this.$items();
    nbNew = 0;
    $.each(items, (function(_this) {
      return function(index, value) {
        var url;
        if (_this.isAtom()) {
          url = $(value).find("link").attr("href");
        } else {
          url = $(value).find("link").text();
        }
        if (last && _this.cleanGoogle(url) === _this.cleanGoogle(last)) {
          return false;
        }
        return nbNew++;
      };
    })(this));
    return nbNew;
  };

  Feed.prototype.links = function(options) {
    var _links, from, items, last, state;
    _links = [];
    from = options.feedClass;
    state = "new";
    last = this.attributes.last;
    items = this.$items();
    $.each(items, (function(_this) {
      return function(index, value) {
        var description, link, title, url;
        title = $(value).find("title").text();
        if (_this.isAtom()) {
          url = $(value).find("link").attr("href");
          description = $(value).find("content").text();
          if (description === "") {
            description = $(value).find("summary").text();
          }
        } else {
          url = $(value).find("link").text();
          description = $(value).find("content\\:encoded").text();
          if (description === "") {
            description = $(value).find("description").text();
          }
        }
        if (last && url === last) {
          state = "old";
        }
        link = {
          "title": title,
          "encodedTitle": encodeURIComponent(title),
          "url": _this.cleanGoogle(url),
          "from": from,
          "state": state,
          "description": description
        };
        if (index === 0) {
          _this.last = link.url;
        }
        return _links.push(link);
      };
    })(this));
    return _links;
  };

  Feed.prototype.isNew = function() {
    return this.id == null;
  };

  return Feed;

})(Backbone.Model);
});

;require.register("models/param", function(exports, require, module) {
var Param,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = Param = (function(superClass) {
  extend(Param, superClass);

  function Param() {
    return Param.__super__.constructor.apply(this, arguments);
  }

  Param.prototype.urlRoot = 'params';

  Param.prototype.isNew = function() {
    return this.id == null;
  };

  return Param;

})(Backbone.Model);
});

;require.register("routers/app_router", function(exports, require, module) {
var AppRouter,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = AppRouter = (function(superClass) {
  extend(AppRouter, superClass);

  function AppRouter() {
    return AppRouter.__super__.constructor.apply(this, arguments);
  }

  AppRouter.prototype.routes = {
    '': function() {}
  };

  return AppRouter;

})(Backbone.Router);
});

;require.register("views/app_view", function(exports, require, module) {
var AppRouter, AppView, Feed, FeedsView, ParamsView, View, tips,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('../lib/view');

AppRouter = require('../routers/app_router');

FeedsView = require('./feeds_view');

ParamsView = require('./params_view');

Feed = require('../models/feed');

tips = ["panelTips follow or forget", "panelTips display old links", "panelTips don't read all internet", "panelTips no new link", "panelTips check feeds once", "panelTips check in evening", "panelTips open interesting feeds", "panelTips check by category", "panelTips contact author", "panelTips take a break", "panelTips no feed during holidays", "panelTips no feed during weekend", "panelTips check environment before starting", "panelTips share only interesting link", "panelTips check info before sharing", "panelTips look poulp or help", "panelTips visit forum", "panelTips give star on github", "panelTips modify feed", "panelTips change colors"];

module.exports = AppView = (function(superClass) {
  extend(AppView, superClass);

  function AppView() {
    this.linkDetails = bind(this.linkDetails, this);
    this.updateSettings = bind(this.updateSettings, this);
    this.addFeed = bind(this.addFeed, this);
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = function() {
    return require('./templates/home');
  };

  AppView.prototype.events = {
    "click .link": "linkDetails",
    "click .welcome-add-feed": "showAddAFeed",
    "click .welcome-add-feeds": "showImportExport",
    "submit .add-one-feed": "addFeed",
    "change #import-file": "uploadFile",
    "submit .import": "import"
  };

  AppView.prototype.startWaiter = function($elem) {
    var html;
    html = "<img " + "src='images/loader.gif' " + "class='main loader' " + "alt='loading ...' />";
    return $elem.append(html);
  };

  AppView.prototype.stopWaiter = function($elem) {
    return $elem.find(".main.loader").remove();
  };

  AppView.prototype.showWelcome = function() {
    return $("#menu-tabs-welcome a").tab("show");
  };

  AppView.prototype.showLinks = function() {
    return $("#menu-tabs-links a").tab("show");
  };

  AppView.prototype.showAddAFeed = function() {
    return $("#menu-tabs-add-feeds a").tab("show");
  };

  AppView.prototype.showImportExport = function() {
    return $("#menu-tabs-import-export a").tab("show");
  };

  AppView.prototype.setTotd = function() {
    var day;
    day = (new Date()).getDate() % tips.length;
    return $(".tip-of-the-day p:first").html(t(tips[day]));
  };

  AppView.prototype.afterRender = function() {
    this.setTotd();
    this.feedsView = new FeedsView();
    this.startWaiter(this.feedsView.$el);
    this.feedsView.collection.fetch({
      success: (function(_this) {
        return function(view, feeds) {
          _this.stopWaiter(_this.feedsView.$el);
          if (!(feeds != null ? feeds.length : void 0)) {
            return _this.showWelcome();
          } else {
            return _this.showLinks();
          }
        };
      })(this)
    });
    this.paramsView = new ParamsView();
    this.startWaiter(this.paramsView.$el);
    return this.paramsView.collection.fetch({
      success: (function(_this) {
        return function(view, parameters) {
          _this.updateSettings();
          return _this.stopWaiter(_this.paramsView.$el);
        };
      })(this)
    });
  };

  AppView.prototype.initialize = function() {
    return this.router = CozyApp.Routers.AppRouter = new AppRouter();
  };

  AppView.prototype.cleanAddFeedForm = function() {
    return $(".add-one-feed").find("input").val("");
  };

  AppView.prototype.createFeed = function(evt, url, tags) {
    var feed;
    feed = new Feed({
      url: url,
      tags: tags
    });
    return this.feedsView.collection.create(feed, {
      success: (function(_this) {
        return function(elem) {
          var elems, i, j, len, len1, tag;
          elems = $("." + elem.cid);
          console.log(elems);
          tags = elems.parents(".tag-open");
          for (i = 0, len = tags.length; i < len; i++) {
            tag = tags[i];
            tag = $(tag);
            $(tag).find(".tag-refresh").click();
          }
          tags = elems.parents(".tag-close");
          for (j = 0, len1 = tags.length; j < len1; j++) {
            tag = tags[j];
            tag = $(tag);
            $(tag).find(".tag-title").click();
          }
          return _this.cleanAddFeedForm();
        };
      })(this),
      error: (function(_this) {
        return function() {
          return View.error(t("error server error feed not added"));
        };
      })(this)
    });
  };

  AppView.prototype.addFeed = function(evt) {
    var tags, url;
    url = $("#add-feed-url").val();
    tags = $("#add-feed-tags").val().split(',').map(function(tag) {
      return $.trim(tag);
    });
    if ((url != null ? url.length : void 0) > 0) {
      this.createFeed(evt, url, tags);
      evt.preventDefault();
    } else {
      View.error(t("error url field required"));
    }
    return false;
  };

  AppView.prototype.updateSettings = function() {
    var i, id, len, parameter, ref, results, value;
    ref = this.paramsView.collection.models;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      parameter = ref[i];
      value = parameter.get("value");
      id = parameter.get("paramId");
      if (value === "true") {
        results.push($("body").addClass(id));
      } else {
        results.push($("body").removeClass(id));
      }
    }
    return results;
  };

  AppView.prototype.linkDetails = function(evt) {
    var link;
    link = $(evt.currentTarget);
    if (!$(evt.target).is("a")) {
      return link.toggleClass("link-active");
    }
  };

  AppView.prototype.addFeedFromFile = function(feedObj) {
    var feed;
    feed = new Feed(feedObj);
    return this.feedsView.collection.create(feed, {
      success: (function(_this) {
        return function(elem) {
          var imported;
          imported = $(".import-success");
          if (imported.text()) {
            imported.text(parseInt(imported.text()) + 1);
          } else {
            imported.text(1);
          }
          return $("." + elem.cid).parents(".tag").find(".feed").show();
        };
      })(this),
      error: (function(_this) {
        return function() {
          var notImported;
          notImported = $(".import-failed");
          if (notImported.text()) {
            return notImported.text(parseInt(notImported.text()) + 1);
          } else {
            return notImported.text(1);
          }
        };
      })(this)
    });
  };

  AppView.prototype.addFeedFromHTMLFile = function(link) {
    var $link, description, feedObj, next, title, url;
    $link = $(link);
    if ($link.attr("feedurl")) {
      url = $link.attr("feedurl");
      title = $link.text();
      description = "";
      next = $link.parents(":first").next();
      if (next.is("dd")) {
        description = next.text();
      }
      feedObj = {
        url: url,
        tags: [""],
        description: description
      };
      return this.addFeedFromFile(feedObj);
    }
  };

  AppView.prototype.addFeedsFromHTMLFile = function(loaded) {
    var i, len, link, links, results;
    links = loaded.find("dt a");
    results = [];
    for (i = 0, len = links.length; i < len; i++) {
      link = links[i];
      results.push(this.addFeedFromHTMLFile(link));
    }
    return results;
  };

  AppView.prototype.addFeedFromOPMLFile = function(link, tag) {
    var $link, description, feedObj, title, url;
    $link = $(link);
    if ($link.attr("xmlUrl")) {
      url = $link.attr("xmlUrl");
      title = $link.attr("title");
      description = $link.attr("text");
      feedObj = {
        url: url,
        tags: [tag],
        description: description
      };
      return this.addFeedFromFile(feedObj);
    }
  };

  AppView.prototype.addFeedsFromOPMLFile = function(loaded) {
    var $link, i, len, link, links, results, tag, taggedLink, taggedLinks;
    links = loaded.find("> outline");
    results = [];
    for (i = 0, len = links.length; i < len; i++) {
      link = links[i];
      $link = $(link);
      if ($link.attr("xmlUrl")) {
        results.push(this.addFeedFromOPMLFile(link, ""));
      } else {
        tag = $link.attr("title");
        taggedLinks = $link.find("outline");
        results.push((function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = taggedLinks.length; j < len1; j++) {
            taggedLink = taggedLinks[j];
            results1.push(this.addFeedFromOPMLFile(taggedLink, tag));
          }
          return results1;
        }).call(this));
      }
    }
    return results;
  };

  AppView.prototype.addFeedsFromFile = function(file) {
    var loaded;
    loaded = $(file);
    if (loaded.is("opml")) {
      return this.addFeedsFromOPMLFile(loaded);
    } else {
      return this.addFeedsFromHTMLFile(loaded);
    }
  };

  AppView.prototype.isUnknownFormat = function(file) {
    console.log(file.name, /.opml$/.test(file.name));
    return file.type !== "text/html" && file.type !== "text/xml" && file.type !== "text/x-opml+xml" && !/.opml$/.test(file.name);
  };

  AppView.prototype.uploadFile = function(evt) {
    var file, reader;
    file = evt.target.files[0];
    if (this.isUnknownFormat(file)) {
      View.error(t("error file cannot be imported"));
      return;
    }
    reader = new FileReader();
    reader.onload = (function(_this) {
      return function(evt) {
        return _this.addFeedsFromFile(evt.target.result);
      };
    })(this);
    return reader.readAsText(file);
  };

  AppView.prototype["import"] = function(evt) {
    $("#import-file").click();
    return false;
  };

  return AppView;

})(View);
});

;require.register("views/feed_view", function(exports, require, module) {
var FeedView, View, linkTemplate, tagTemplate,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('../lib/view');

linkTemplate = require('./templates/link');

tagTemplate = require('./templates/tag');

module.exports = FeedView = (function(superClass) {
  extend(FeedView, superClass);

  FeedView.prototype.className = 'feed';

  FeedView.prototype.tagName = 'div';

  function FeedView(model, clone) {
    this.model = model;
    this.clone = clone;
    FeedView.__super__.constructor.call(this);
  }

  FeedView.prototype.template = function() {
    var template;
    template = require('./templates/feed');
    return template(this.getRenderData());
  };

  FeedView.prototype.events = {
    "click": "onUpdateClicked",
    "click .feed-count": "setUpdate",
    "click .feed-delete": "onDeleteClicked",
    "mouseenter .feed-delete": "setToDelete",
    "mouseleave .feed-delete": "setToNotDelete"
  };

  FeedView.prototype.startWaiter = function() {
    return this.$el.addClass("feed-loading");
  };

  FeedView.prototype.stopWaiter = function() {
    return this.$el.removeClass("feed-loading");
  };

  FeedView.prototype.setToDelete = function() {
    return this.$el.addClass("feed-to-delete");
  };

  FeedView.prototype.setToNotDelete = function() {
    return this.$el.removeClass("feed-to-delete");
  };

  FeedView.prototype.addToTag = function(tag) {
    var elem, exists, tagPlace, tmpl;
    tmpl = tagTemplate;
    tag = $.trim(tag) || "untagged";
    tagPlace = $(".tag-" + tag);
    if (tagPlace.length === 0) {
      tagPlace = $(tmpl({
        "name": tag
      }));
      $("#panel-feeds").append(tagPlace);
    }
    exists = tagPlace.find("." + this.model.cid);
    if ($("." + this.model.cid).length) {
      elem = new FeedView(this.model, true).$el;
      elem.addClass("clone");
    } else {
      elem = this.$el;
    }
    if (exists.length) {
      return exists.replaceAll(elem);
    } else {
      return tagPlace.find(".tag-feeds").append(elem);
    }
  };

  FeedView.prototype.setCount = function(count) {
    var place;
    if (count == null) {
      count = this.model.count();
    }
    place = $("." + this.model.cid).find(".feed-count");
    if (count) {
      place.html(count);
      return place.addClass("label");
    } else {
      place.html("");
      return place.removeClass("label");
    }
  };

  FeedView.prototype.setUpdate = function(displayLinks) {
    var $allThat, error, error1, title;
    $allThat = $("." + this.model.cid);
    try {
      title = this.model.titleText();
    } catch (error1) {
      error = error1;
      this.stopWaiter();
      View.error(t("error cannot parse feed"));
      return false;
    }
    if (this.$el.is(":visible")) {
      this.startWaiter();
      this.model.save({
        "title": title,
        "content": ""
      }, {
        success: (function(_this) {
          return function() {
            var last;
            _this.stopWaiter();
            if (displayLinks === true) {
              _this.renderXml();
              _this.$el.addClass("feed-open");
              $(".list-links").addClass("full");
              $("#panel-links .panel-tips").addClass("hidden");
              _this.setCount(0);
              last = _this.model.last;
              title = _this.model.titleText();
              console.log("last", last);
              _this.model.save({
                "title": title,
                "last": last,
                "content": ""
              });
            } else {
              _this.setCount();
            }
            if (!title) {
              title = _this.model.titleText();
              if (title) {
                _this.model.save({
                  "title": title,
                  "content": ""
                });
                $allThat.find("a").html(title);
                View.log("" + title + " " + t("feed reloaded"));
              }
            }
            return setTimeout(_.bind(_this.setUpdate, _this), (1 + Math.floor(Math.random() * 14)) * 60000);
          };
        })(this),
        error: (function(_this) {
          return function() {
            _this.stopWaiter();
            return setTimeout(_.bind(_this.setUpdate, _this), (11 + Math.floor(Math.random() * 14)) * 60000);
          };
        })(this)
      });
    }
    return false;
  };

  FeedView.prototype.render = function() {
    var i, len, tag, tags;
    this.$el.html(this.template({}));
    this.$el.addClass(this.model.cid);
    if (this.clone) {
      return;
    }
    tags = this.model.attributes.tags || ["untagged"];
    if (typeof tags === "string") {
      tags = tags.split(",");
    }
    for (i = 0, len = tags.length; i < len; i++) {
      tag = tags[i];
      this.addToTag(tag);
    }
    return this;
  };

  FeedView.prototype.feedClass = function() {
    var title;
    title = $.trim(this.model.attributes.title);
    if (title) {
      return title.replace(/[\s!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
    } else {
      return "link" + this.model.cid;
    }
  };

  FeedView.prototype.renderXml = function() {
    var links, tmpl, withCozyBookmarks;
    withCozyBookmarks = $("#cozy-bookmarks-name").val();
    tmpl = linkTemplate;
    links = this.model.links({
      "feedClass": this.feedClass()
    });
    if (!links.length) {
      View.error(t("error no link found"));
      return;
    }
    links.reverse();
    return $.each(links, function(index, link) {
      link.toCozyBookMarks = withCozyBookmarks;
      return $(".links").prepend($(tmpl(link)));
    });
  };

  FeedView.prototype.cleanLinks = function() {
    var existingLinks;
    existingLinks = $(".link");
    return existingLinks.remove();
  };

  FeedView.prototype.cleanOpenedFeed = function() {
    var current;
    current = $(".feed-open");
    return current.removeClass("feed-open");
  };

  FeedView.prototype.onUpdateClicked = function(evt) {
    var $target;
    this.startWaiter();
    evt.preventDefault();
    $target = $(evt.currentTarget);
    this.cleanLinks();
    if ($target.hasClass("feed-open")) {
      this.cleanOpenedFeed();
      $(".list-links").removeClass("full");
      $("#panel-links .panel-tips").removeClass("hidden");
      this.stopWaiter();
    } else {
      this.cleanOpenedFeed();
      this.setUpdate(true);
      $("#menu-tabs-links a").tab("show");
    }
    return false;
  };

  FeedView.prototype.refillAddForm = function() {
    var tags, title, url;
    title = this.$el.find(".feed-title a");
    url = title.attr("href");
    tags = title.attr("data-tags") || "";
    $("#add-feed-url").val(url);
    $("#add-feed-tags").val(tags);
    return $("#menu-tabs-add-feeds a").tab("show");
  };

  FeedView.prototype.fullRemove = function() {
    var existingLinks, i, len, myTag, myTags;
    myTags = $("." + this.model.cid).parents(".tag");
    for (i = 0, len = myTags.length; i < len; i++) {
      myTag = myTags[i];
      myTag = $(myTag);
      if (myTag.find(".feed").length === 1) {
        myTag.remove();
      }
    }
    this.destroy();
    existingLinks = $("." + this.model.cid);
    if (existingLinks.length) {
      existingLinks.remove();
    }
    return $(".clone." + this.model.cid).remove();
  };

  FeedView.prototype.onDeleteClicked = function(evt) {
    this.model.destroy({
      success: (function(_this) {
        return function() {
          var title;
          _this.refillAddForm();
          _this.fullRemove();
          title = _this.model.titleText();
          if (title) {
            return View.log("" + title + " " + t("feed removed placed in form"));
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return View.error(t("error server error feed not deleted"));
        };
      })(this)
    });
    evt.preventDefault();
    return false;
  };

  return FeedView;

})(View);
});

;require.register("views/feeds_view", function(exports, require, module) {
var FeedCollection, FeedView, FeedsView, ViewCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('../lib/view_collection');

FeedView = require('./feed_view');

FeedCollection = require('../collections/feed_collection');

module.exports = FeedsView = (function(superClass) {
  extend(FeedsView, superClass);

  function FeedsView() {
    return FeedsView.__super__.constructor.apply(this, arguments);
  }

  FeedsView.prototype.el = '#panel-feeds';

  FeedsView.prototype.view = FeedView;

  FeedsView.prototype.events = {
    "click .tag-title": "onTagClicked",
    "click .tag-refresh": "onReloadTagClicked",
    "mouseenter .tag-header": "setToFullHover",
    "mouseleave .tag-header": "setToNotFullHover"
  };

  FeedsView.prototype.setToFullHover = function(evt) {
    var target;
    target = $(evt.currentTarget).parents(".tag:first");
    return target.addClass("hover");
  };

  FeedsView.prototype.setToNotFullHover = function(evt) {
    var target;
    target = $(evt.currentTarget).parents(".tag:first");
    return target.removeClass("hover");
  };

  FeedsView.prototype.reloadCounts = function($target) {
    var feed, feeds, i, len, results;
    feeds = $target.find(".feed");
    results = [];
    for (i = 0, len = feeds.length; i < len; i++) {
      feed = feeds[i];
      results.push($(feed).find(".feed-count").click());
    }
    return results;
  };

  FeedsView.prototype.onReloadTagClicked = function(evt) {
    var $target;
    $target = $(evt.currentTarget).parents(".tag:first");
    this.reloadCounts($target);
    return false;
  };

  FeedsView.prototype.cleanLinks = function() {
    var existingLinks;
    existingLinks = $(".link");
    return existingLinks.remove();
  };

  FeedsView.prototype.onTagClicked = function(evt) {
    var $target;
    $target = $(evt.currentTarget).parent(".tag:first");
    if ($target.hasClass("tag-open")) {
      $target.removeClass("tag-open");
      $target.addClass("tag-close");
      if ($target.find(".feed-open").length) {
        this.cleanLinks();
        $target.find(".feed-open").removeClass("feed-open");
      }
    } else {
      $target.removeClass("tag-close");
      $target.addClass("tag-open");
      this.reloadCounts($target);
    }
    return false;
  };

  FeedsView.prototype.initialize = function() {
    return this.collection = new FeedCollection(this);
  };

  return FeedsView;

})(ViewCollection);
});

;require.register("views/param_view", function(exports, require, module) {
var ParamView, View,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require("../lib/view");

module.exports = ParamView = (function(superClass) {
  extend(ParamView, superClass);

  ParamView.prototype.className = "checkbox";

  ParamView.prototype.tagName = "div";

  function ParamView(model) {
    this.model = model;
    ParamView.__super__.constructor.call(this);
  }

  ParamView.prototype.template = function() {
    var template;
    template = require("./templates/param");
    return template(this.getRenderData());
  };

  ParamView.prototype.events = {
    "change input": "update"
  };

  ParamView.prototype.update = function(evt) {
    var checked;
    checked = this.$el.find("input").prop("checked") || false;
    this.model.save({
      "value": checked
    });
    if (checked) {
      return $("body").addClass(this.model.get("paramId"));
    } else {
      return $("body").removeClass(this.model.get("paramId"));
    }
  };

  return ParamView;

})(View);
});

;require.register("views/params_view", function(exports, require, module) {
var ParamCollection, ParamView, ParamsView, ViewCollection,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ViewCollection = require('../lib/view_collection');

ParamView = require('./param_view');

ParamCollection = require('../collections/param_collection');

module.exports = ParamsView = (function(superClass) {
  extend(ParamsView, superClass);

  function ParamsView() {
    this.renderOne = bind(this.renderOne, this);
    return ParamsView.__super__.constructor.apply(this, arguments);
  }

  ParamsView.prototype.el = '#settings';

  ParamsView.prototype.view = ParamView;

  ParamsView.prototype.initialize = function() {
    return this.collection = new ParamCollection(this);
  };

  ParamsView.prototype.renderOne = function(model) {
    var view;
    view = new this.view(model);
    this.$el.append(view.render().el);
    this.add(view);
    return this;
  };

  return ParamsView;

})(ViewCollection);
});

;require.register("views/templates/feed", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (model) {
var title = model.title ? model.title : model.url
buf.push("<div class=\"feed-infos\"><div class=\"feed-delete\">&times;</div><div class=\"feed-spinner\"><img src=\"images/loader.gif\" alt=\"...\" class=\"loader\"/></div><div class=\"feed-count\"></div></div><div class=\"feed-title\"> <a" + (jade.attr("href", "" + (model.url) + "", true, false)) + (jade.attr("title", "" + (title) + "", true, false)) + (jade.attr("data-tags", "" + (model.tags) + "", true, false)) + ">" + (jade.escape((jade_interp = title) == null ? '' : jade_interp)) + "</a></div>");}.call(this,"model" in locals_for_with?locals_for_with.model:typeof model!=="undefined"?model:undefined));;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/home", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div id=\"content\"><div id=\"menu\" class=\"row\"><div id=\"menu-refresh-all\" class=\"hidden-xs col-lg-2\"></div><div id=\"menu-tabs\" class=\"col-xs-12 col-lg-10\"><ul id=\"menu-tabs-nav\" role=\"tablist\" class=\"nav nav-tabs\"><li id=\"menu-tabs-welcome\" role=\"presentation\" class=\"hidden-xs\"><a href=\"#panel-welcome\"></a></li><li id=\"menu-tabs-links\" role=\"presentation\"><a href=\"#panel-links\" aria-controls=\"links\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-home\">" + (jade.escape(null == (jade_interp = t("links")) ? "" : jade_interp)) + "</span></a></li><li id=\"menu-tabs-history\" role=\"presentation\"><a href=\"#panel-history\" aria-controls=\"history\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-time\">" + (jade.escape(null == (jade_interp = t("history")) ? "" : jade_interp)) + "</span></a></li><li id=\"menu-tabs-add-feeds\" role=\"presentation\"><a href=\"#panel-add-feeds\" aria-controls=\"add-feeds\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-plus\">" + (jade.escape(null == (jade_interp = t("add feeds")) ? "" : jade_interp)) + "</span></a></li><li id=\"menu-tabs-import-export\" role=\"presentation\"><a href=\"#panel-import-export\" aria-controls=\"import-export\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-transfer\">" + (jade.escape(null == (jade_interp = t("import export")) ? "" : jade_interp)) + "</span></a></li><li id=\"menu-tabs-settings\" role=\"presentation\"><a href=\"#panel-settings\" aria-controls=\"settings\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-cog\">" + (jade.escape(null == (jade_interp = t("settings")) ? "" : jade_interp)) + "</span></a></li><li id=\"menu-tabs-help\" role=\"presentation\" class=\"navbar-right\"><a href=\"#panel-help\" aria-controls=\"help\" role=\"tab\" data-toggle=\"tab\" class=\"menu-button\"><span class=\"glyphicon glyphicon-question-sign\">" + (jade.escape(null == (jade_interp = t("help")) ? "" : jade_interp)) + "</span></a></li></ul></div></div><div id=\"panels\" class=\"row\"><div id=\"panel-feeds\" class=\"col-xs-12 col-md-3 col-lg-2\"></div><div id=\"panel-main\" class=\"col-xs-12 col-md-9 col-lg-10\"><div id=\"panel-main-tabs\" class=\"tab-content\"><div id=\"panel-welcome\" role=\"tabpanel\" class=\"tab-pane fade\"><h1 class=\"welcome-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/><p>" + (jade.escape(null == (jade_interp = t("panelWelcome welcome to zero feeds")) ? "" : jade_interp)) + "</p></h1><div class=\"welcome-message\"><p>" + (jade.escape(null == (jade_interp = t("panelWelcome presentation")) ? "" : jade_interp)) + "</p><p class=\"welcome-start\">" + (jade.escape(null == (jade_interp = t("panelWelcome start now")) ? "" : jade_interp)) + "</p><div class=\"welcome-actions\"><div class=\"welcome-add-feed btn btn-default\">" + (jade.escape(null == (jade_interp = t("panelWelcome add your first feed")) ? "" : jade_interp)) + "</div><div class=\"welcome-add-feeds btn btn-invert\">" + (jade.escape(null == (jade_interp = t("panelWelcome import opml file")) ? "" : jade_interp)) + "</div></div></div></div><div id=\"panel-links\" role=\"tabpanel\" class=\"tab-pane fade\"><div class=\"list-links col-xs-12 col-md-7 col-lg-9\"><div class=\"links-title\"><h1>" + (jade.escape(null == (jade_interp = t("links")) ? "" : jade_interp)) + "</h1><h3>" + (jade.escape(null == (jade_interp = t("panelLinks new articles")) ? "" : jade_interp)) + "</h3></div><div class=\"links\"></div></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"><div class=\"tip-of-the-day\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/>" + (jade.escape(null == (jade_interp = t("panelTips tip of the day")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTips display old links")) ? "" : jade_interp)) + "</p></div><div class=\"tip-questions\"><div class=\"tip-title\">" + (jade.escape(null == (jade_interp = t("panelTips any question")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTips visit help")) ? "" : jade_interp)) + "</p></div></div></div><div id=\"panel-history\" role=\"tabpanel\" class=\"tab-pane fade row\"><div class=\"col-xs-12 col-md-7 col-lg-9\"><h1>" + (jade.escape(null == (jade_interp = t("comming soon")) ? "" : jade_interp)) + "</h1></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"></div></div><div id=\"panel-add-feeds\" role=\"tabpanel\" class=\"tab-pane fade row\"><div class=\"col-xs-12 col-md-7 col-lg-9\"><h1 class=\"add-feed-title\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds add a feed")) ? "" : jade_interp)) + "</h1><form role=\"form\" class=\"add-one-feed\"><div class=\"form-group\"><label for=\"add-feed-url\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds feed url")) ? "" : jade_interp)) + "</label><input id=\"add-feed-url\" name=\"add-feed-url\" placeholder=\"http://\" class=\"form-control\"/></div><div class=\"form-group\"><label for=\"add-feed-tags\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds tags separated by")) ? "" : jade_interp)) + "</label><input id=\"add-feed-tags\" name=\"add-feed\"" + (jade.attr("placeholder", t('panelAddFeeds science diy'), true, false)) + " class=\"form-control\"/></div><button type=\"submit\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds add feed").toUpperCase()) ? "" : jade_interp)) + "</span></button></form></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"><div class=\"tip\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed follow new site")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed find rss/atom link")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed fill url and tag")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed add feed")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed tag and feed in left panel")) ? "" : jade_interp)) + "</p></div></div></div><div id=\"panel-import-export\" role=\"tabpanel\" class=\"tab-pane fade row\"><div class=\"col-xs-12 col-md-7 col-lg-9\"><h1>" + (jade.escape(null == (jade_interp = t("panelImportExport import")) ? "" : jade_interp)) + "</h1><iframe style=\"display:none\"></iframe><form role=\"form\" class=\"import\"><h3>" + (jade.escape(null == (jade_interp = t("panelImportExport description import")) ? "" : jade_interp)) + "</h3><input id=\"import-file\" type=\"file\" name=\"feeds-file\" style=\"display:none\"/><button type=\"submit\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-cloud-upload\">" + (jade.escape(null == (jade_interp = t("panelImportExport import").toUpperCase()) ? "" : jade_interp)) + "</span></button><div class=\"results\"><span class=\"import-success label label-success\">0</span><span class=\"import-failed label label-danger\">0</span></div></form><h1>" + (jade.escape(null == (jade_interp = t("panelImportExport export")) ? "" : jade_interp)) + "</h1><form role=\"form\" class=\"import\"><h3>" + (jade.escape(null == (jade_interp = t("comming soon")) ? "" : jade_interp)) + "</h3></form></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"></div></div><div id=\"panel-settings\" role=\"tabpanel\" class=\"tab-pane fade row\"><div class=\"ccol-xs-12 ol-md-7 col-lg-9\"><h1>" + (jade.escape(null == (jade_interp = t("settings")) ? "" : jade_interp)) + "</h1><form id=\"settings\" role=\"form\"></form></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"><div class=\"tip\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/></div><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings old links description")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings old links default behaviour")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings show old links")) ? "" : jade_interp)) + "</p></div></div></div><div id=\"panel-help\" role=\"tabpanel\" class=\"tab-pane fade\"><div class=\"ccol-xs-12 ol-md-7 col-lg-9\"><h1>" + (jade.escape(null == (jade_interp = t("help")) ? "" : jade_interp)) + "<h3>" + (jade.escape(null == (jade_interp = t("help how does it work")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help tool presentation")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("help idea behind")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("help difference from others reader")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help news of the year")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help news of the year answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help scale 6000 feeds")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help scale 6000 feeds answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how do i start")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how do i start answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how to add add feed")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how to add add feed answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how to edit feed")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how to edit feed answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help only beginning of feed url")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help only beginning of feed url answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help what are tags")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help what are tags answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help don't reload all feeds")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help don't reload all feeds answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help links disappeared")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help links disappeared answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help retrieve old links")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help retrieve old links answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help what is quickmark app")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help what is quickmark app answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help it still doesn't work")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help please")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://github.com/pierrerousseau/zero-feeds/issues\" target=\"_blank\">" + (jade.escape((jade_interp = t("help add an issue")) == null ? '' : jade_interp)) + "</a>&nbsp;" + (jade.escape(null == (jade_interp = t("help and help me to help you")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help free softwares")) ? "" : jade_interp)) + "</h3><p><a href=\"https://github.com/pierrerousseau/zero-feeds\" target=\"_blank\">" + (jade.escape((jade_interp = t("help me too")) == null ? '' : jade_interp)) + "</a>. &nbsp;" + (jade.escape(null == (jade_interp = t("help licence")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://en.wikipedia.org/wiki/WTFPL\" target=\"_blank\">WTFPL</a>.</p></h1></div><div class=\"panel-tips hidden-xs col-md-5 col-lg-3\"><div class=\"tip-issues\"><div class=\"tip-title\">" + (jade.escape(null == (jade_interp = t("help report a bug")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("help please")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://github.com/pierrerousseau/zero-feeds/issues\" target=\"_blank\">" + (jade.escape((jade_interp = t("help add an issue")) == null ? '' : jade_interp)) + "</a>&nbsp;" + (jade.escape(null == (jade_interp = t("help and help me to help you")) ? "" : jade_interp)) + "</p></div></div></div></div></div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/link", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (description, encodedTitle, from, state, title, url) {
buf.push("<li" + (jade.cls(["link " + (from) + " link-" + (state) + ""], [true])) + "><div class=\"panel panel-default\"><div class=\"panel-heading\"><h3 class=\"link-title panel-title\"><a" + (jade.attr("href", "" + (url) + "", true, false)) + " target=\"_blank\">" + (jade.escape((jade_interp = title) == null ? '' : jade_interp)) + "</a></h3><a" + (jade.attr("title", t("link send to twitter"), true, false)) + (jade.attr("href", "https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + "", true, false)) + " target=\"_blank\"><span class=\"fa fa-twitter\"></span></a></div><div class=\"panel-body\"><div class=\"link-infos\"></div><div class=\"link-description\">" + (((jade_interp = description) == null ? '' : jade_interp)) + "</div></div><div class=\"panel-footer\"><div class=\"link-buttons\"><a" + (jade.attr("href", "" + (url) + "", true, false)) + " target=\"_blank\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-link\">" + (jade.escape(null == (jade_interp = t("link open and read now")) ? "" : jade_interp)) + "</span></a><a title=\"send to Twitter\"" + (jade.attr("href", "https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + "", true, false)) + " target=\"_blank\" class=\"btn btn-invert\"><span class=\"fa fa-twitter\">" + (jade.escape(null == (jade_interp = t("link share")) ? "" : jade_interp)) + "</span></a></div></div></div></li>");}.call(this,"description" in locals_for_with?locals_for_with.description:typeof description!=="undefined"?description:undefined,"encodedTitle" in locals_for_with?locals_for_with.encodedTitle:typeof encodedTitle!=="undefined"?encodedTitle:undefined,"from" in locals_for_with?locals_for_with.from:typeof from!=="undefined"?from:undefined,"state" in locals_for_with?locals_for_with.state:typeof state!=="undefined"?state:undefined,"title" in locals_for_with?locals_for_with.title:typeof title!=="undefined"?title:undefined,"url" in locals_for_with?locals_for_with.url:typeof url!=="undefined"?url:undefined));;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-add-feeds", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1 class=\"add-feed-title\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds add a feed")) ? "" : jade_interp)) + "</h1><form role=\"form\" class=\"add-one-feed\"><div class=\"form-group\"><label for=\"add-feed-url\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds feed url")) ? "" : jade_interp)) + "</label><input id=\"add-feed-url\" name=\"add-feed-url\" placeholder=\"http://\" class=\"form-control\"/></div><div class=\"form-group\"><label for=\"add-feed-tags\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds tags separated by")) ? "" : jade_interp)) + "</label><input id=\"add-feed-tags\" name=\"add-feed\"" + (jade.attr("placeholder", t('panelAddFeeds science diy'), true, false)) + " class=\"form-control\"/></div><button type=\"submit\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\">" + (jade.escape(null == (jade_interp = t("panelAddFeeds add feed").toUpperCase()) ? "" : jade_interp)) + "</span></button></form>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-help", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1>" + (jade.escape(null == (jade_interp = t("help")) ? "" : jade_interp)) + "<h3>" + (jade.escape(null == (jade_interp = t("help how does it work")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help tool presentation")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("help idea behind")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("help difference from others reader")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help news of the year")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help news of the year answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help scale 6000 feeds")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help scale 6000 feeds answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how do i start")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how do i start answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how to add add feed")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how to add add feed answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help how to edit feed")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help how to edit feed answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help only beginning of feed url")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help only beginning of feed url answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help what are tags")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help what are tags answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help don't reload all feeds")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help don't reload all feeds answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help links disappeared")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help links disappeared answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help retrieve old links")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help retrieve old links answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help what is quickmark app")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help what is quickmark app answer")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help it still doesn't work")) ? "" : jade_interp)) + "</h3><p>" + (jade.escape(null == (jade_interp = t("help please")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://github.com/pierrerousseau/zero-feeds/issues\" target=\"_blank\">" + (jade.escape((jade_interp = t("help add an issue")) == null ? '' : jade_interp)) + "</a>&nbsp;" + (jade.escape(null == (jade_interp = t("help and help me to help you")) ? "" : jade_interp)) + "</p><h3>" + (jade.escape(null == (jade_interp = t("help free softwares")) ? "" : jade_interp)) + "</h3><p><a href=\"https://github.com/pierrerousseau/zero-feeds\" target=\"_blank\">" + (jade.escape((jade_interp = t("help me too")) == null ? '' : jade_interp)) + "</a>. &nbsp;" + (jade.escape(null == (jade_interp = t("help licence")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://en.wikipedia.org/wiki/WTFPL\" target=\"_blank\">WTFPL</a>.</p></h1>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-history", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1>" + (jade.escape(null == (jade_interp = t("comming soon")) ? "" : jade_interp)) + "</h1>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-import-export", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1>" + (jade.escape(null == (jade_interp = t("panelImportExport import")) ? "" : jade_interp)) + "</h1><iframe style=\"display:none\"></iframe><form role=\"form\" class=\"import\"><h3>" + (jade.escape(null == (jade_interp = t("panelImportExport description import")) ? "" : jade_interp)) + "</h3><input id=\"import-file\" type=\"file\" name=\"feeds-file\" style=\"display:none\"/><button type=\"submit\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-cloud-upload\">" + (jade.escape(null == (jade_interp = t("panelImportExport import").toUpperCase()) ? "" : jade_interp)) + "</span></button><div class=\"results\"><span class=\"import-success label label-success\">0</span><span class=\"import-failed label label-danger\">0</span></div></form><h1>" + (jade.escape(null == (jade_interp = t("panelImportExport export")) ? "" : jade_interp)) + "</h1><form role=\"form\" class=\"import\"><h3>" + (jade.escape(null == (jade_interp = t("comming soon")) ? "" : jade_interp)) + "</h3></form>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-links", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"links-title\"><h1>" + (jade.escape(null == (jade_interp = t("links")) ? "" : jade_interp)) + "</h1><h3>" + (jade.escape(null == (jade_interp = t("panelLinks new articles")) ? "" : jade_interp)) + "</h3></div><div class=\"links\"></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-settings", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1>" + (jade.escape(null == (jade_interp = t("settings")) ? "" : jade_interp)) + "</h1><form id=\"settings\" role=\"form\"></form>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-tips-add-feeds", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"tip\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed follow new site")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed find rss/atom link")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed fill url and tag")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed add feed")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsAddFeed tag and feed in left panel")) ? "" : jade_interp)) + "</p></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-tips-help", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"tip-issues\"><div class=\"tip-title\">" + (jade.escape(null == (jade_interp = t("help report a bug")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("help please")) ? "" : jade_interp)) + "&nbsp;<a href=\"https://github.com/pierrerousseau/zero-feeds/issues\" target=\"_blank\">" + (jade.escape((jade_interp = t("help add an issue")) == null ? '' : jade_interp)) + "</a>&nbsp;" + (jade.escape(null == (jade_interp = t("help and help me to help you")) ? "" : jade_interp)) + "</p></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-tips-settings", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"tip\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/></div><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings old links description")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings old links default behaviour")) ? "" : jade_interp)) + "</p><p>" + (jade.escape(null == (jade_interp = t("panelTipsSettings show old links")) ? "" : jade_interp)) + "</p></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-tips", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<div class=\"tip-of-the-day\"><div class=\"tip-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/>" + (jade.escape(null == (jade_interp = t("panelTips tip of the day")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTips display old links")) ? "" : jade_interp)) + "</p></div><div class=\"tip-questions\"><div class=\"tip-title\">" + (jade.escape(null == (jade_interp = t("panelTips any question")) ? "" : jade_interp)) + "</div><p>" + (jade.escape(null == (jade_interp = t("panelTips visit help")) ? "" : jade_interp)) + "</p></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/panel-welcome", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

buf.push("<h1 class=\"welcome-title\"><img alt=\"poulpe\" src=\"images/poulpe.svg\" class=\"poulpe\"/><p>" + (jade.escape(null == (jade_interp = t("panelWelcome welcome to zero feeds")) ? "" : jade_interp)) + "</p></h1><div class=\"welcome-message\"><p>" + (jade.escape(null == (jade_interp = t("panelWelcome presentation")) ? "" : jade_interp)) + "</p><p class=\"welcome-start\">" + (jade.escape(null == (jade_interp = t("panelWelcome start now")) ? "" : jade_interp)) + "</p><div class=\"welcome-actions\"><div class=\"welcome-add-feed btn btn-default\">" + (jade.escape(null == (jade_interp = t("panelWelcome add your first feed")) ? "" : jade_interp)) + "</div><div class=\"welcome-add-feeds btn btn-invert\">" + (jade.escape(null == (jade_interp = t("panelWelcome import opml file")) ? "" : jade_interp)) + "</div></div></div>");;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/param", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (model) {
buf.push("<label>");
if (model.value == "true")
{
buf.push("<input" + (jade.attr("id", "settings-" + (model.paramId) + "", true, false)) + (jade.attr("name", "" + (model.paramId) + "", true, false)) + " type=\"checkbox\" checked=\"checked\"" + (jade.attr("value", "" + (model.value) + "", true, false)) + "/>");
}
else
{
buf.push("<input" + (jade.attr("id", "settings-" + (model.paramId) + "", true, false)) + (jade.attr("name", "" + (model.paramId) + "", true, false)) + " type=\"checkbox\"" + (jade.attr("value", "" + (model.value) + "", true, false)) + "/>");
}
buf.push("" + (jade.escape((jade_interp = t(model.description)) == null ? '' : jade_interp)) + "</label>");}.call(this,"model" in locals_for_with?locals_for_with.model:typeof model!=="undefined"?model:undefined));;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;require.register("views/templates/tag", function(exports, require, module) {
var __templateData = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (name) {
buf.push("<div" + (jade.cls(['tag',"tag-close tag-" + (name) + ""], [null,true])) + "><div class=\"tag-title\"><div class=\"tag-toggle\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"glyphicon glyphicon-chevron-down\"></span></div><div class=\"tag-name\">" + (jade.escape((jade_interp = name) == null ? '' : jade_interp)) + "</div><div class=\"tag-refresh\"><span class=\"glyphicon glyphicon-refresh\"></span></div></div><div class=\"tag-feeds\"></div></div>");}.call(this,"name" in locals_for_with?locals_for_with.name:typeof name!=="undefined"?name:undefined));;return buf.join("");
};
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return __templateData;
  });
} else if (typeof module === 'object' && module && module.exports) {
  module.exports = __templateData;
} else {
  __templateData;
}
});

;
//# sourceMappingURL=app.js.map