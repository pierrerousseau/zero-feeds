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
var initializeJQueryExtensions;

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
  var AppView;
  require('../lib/app_helpers');
  initializeJQueryExtensions();
  CozyApp.Views.appView = new (AppView = require('views/app_view'));
  CozyApp.Views.appView.render();
  return Backbone.history.start({
    pushState: true
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
var AppRouter, AppView, Feed, FeedsView, ParamsView, View,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

View = require('../lib/view');

AppRouter = require('../routers/app_router');

FeedsView = require('./feeds_view');

ParamsView = require('./params_view');

Feed = require('../models/feed');

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
    console.log("ok");
    return $("#menu-tabs-add-feeds a").tab("show");
  };

  AppView.prototype.showImportExport = function() {
    console.log("ok 2");
    return $("#menu-tabs-import-export a").tab("show");
  };

  AppView.prototype.afterRender = function() {
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
          return View.error("Server error occured, feed was not added");
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
      View.error("Url field is required");
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
      View.error("This file cannot be imported");
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
    var $allThat, error, title;
    $allThat = $("." + this.model.cid);
    try {
      title = this.model.titleText();
    } catch (_error) {
      error = _error;
      this.stopWaiter();
      View.error("Can't parse feed, please check feed address.");
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
                View.log("" + title + " reloaded");
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
      View.error("No link found, are you sure that the url is correct ?");
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
            return View.log("" + title + " removed and placed in form");
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return View.error("Server error occured, feed was not deleted.");
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
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
 var title = model.title ? model.title : model.url
buf.push('<div class="feed-infos"><div class="feed-delete"> \n&times;</div><div class="feed-spinner"><img src="images/loader.gif" alt="..." class="loader"/></div><div class="feed-count"></div></div><div class="feed-title"> <a');
buf.push(attrs({ 'href':("" + (model.url) + ""), 'title':("" + (title) + ""), 'data-tags':("" + (model.tags) + "") }, {"href":true,"title":true,"data-tags":true}));
buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a></div>');
}
return buf.join("");
};
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div id="content"><div id="menu" class="row"><div id="menu-refresh-all" class="hidden-xs col-lg-3"></div><div id="menu-tabs" class="col-xs-12 col-lg-9"><ul id="menu-tabs-nav" role="tablist" class="nav nav-tabs"><li id="menu-tabs-welcome" role="presentation" class="hidden-xs"> <a href="#panel-welcome"></a></li><li id="menu-tabs-links" role="presentation"> <a href="#panel-links" aria-controls="links" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-home"></span> Links</a></li><li id="menu-tabs-history" role="presentation"> <a href="#panel-history" aria-controls="history" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-time"></span>History</a></li><li id="menu-tabs-add-feeds" role="presentation"> <a href="#panel-add-feeds" aria-controls="add-feeds" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-plus"></span>Add Feeds</a></li><li id="menu-tabs-import-export" role="presentation"> <a href="#panel-import-export" aria-controls="import-export" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-transfer"></span>Import/Export</a></li><li id="menu-tabs-settings" role="presentation"> <a href="#panel-settings" aria-controls="settings" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-cog"></span>Settings</a></li><li id="menu-tabs-help" role="presentation" class="navbar-right"> <a href="#panel-help" aria-controls="help" role="tab" data-toggle="tab" class="menu-button"> <span class="glyphicon glyphicon-question-sign"></span>Help</a></li></ul></div></div><div id="panels" class="row"><div id="panel-feeds" class="col-xs-12 col-md-3"></div><div id="panel-main" class="col-xs-12 col-md-9"> <div id="panel-main-tabs" class="tab-content"><div id="panel-welcome" role="tabpanel" class="tab-pane fade"><h1 class="welcome-title"><img alt="poulpe" src="images/poulpe.svg" class="poulpe"/><p>Welcome to zero-feeds !</p></h1><div class="welcome-message"><p>This application is a RSS/Atom feeds reader designed to minimise the time lost reading them</p><p class="welcome-start">Start now !</p><div class="welcome-actions"><div class="welcome-add-feed btn btn-default">Add your first feed</div><div class="welcome-add-feeds btn btn-invert">Import a .opml file</div></div></div></div><div id="panel-links" role="tabpanel" class="tab-pane fade"><div class="list-links col-xs-12 col-md-7 col-lg-9"><div class="links-title"><h1>Links</h1><h3>new articles from your favorite feeds</h3></div><div class="links"></div></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"><div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>Tip of the day</div><p>Zero-Feeds displays only the new links from your feeds, if you still want them, there is a parameter to change in the settings panel</p></div><div class="tip-questions"><div class="tip-title">Any question ?</div><p>Visit the help section to find out how zero-feeds works.</p></div></div></div><div id="panel-history" role="tabpanel" class="tab-pane fade row"><div class="col-xs-12 col-md-7 col-lg-9"><h1>Comming soon ...</h1></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"></div></div><div id="panel-add-feeds" role="tabpanel" class="tab-pane fade row"> <div class="col-xs-12 col-md-7 col-lg-9"><h1 class="add-feed-title">Add a feed</h1><form role="form" class="add-one-feed"><div class="form-group"><label for="add-feed-url">Feed URL</label><input id="add-feed-url" name="add-feed-url" placeholder="http://" class="form-control"/></div><div class="form-group"><label for="add-feed-tags">Tags (separated by ", ")</label><input id="add-feed-tags" name="add-feed" placeholder="science, diy" class="form-control"/></div><button type="submit" class="btn btn-default"> <span class="glyphicon glyphicon-plus"></span>ADD FEED</button></form></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"><div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>Follow a new site ?</div><p> \nOn your favorite site find the "rss/atom" link.</p><p>Then, fill the url field with this link \nand the tag field with the categories \nthat you want to associtate to this feed.</p><p>Then click on the "Add Feed" button right next to the tags field \n(or hit the enter key in one of the fields).</p><p>The tags and the feed url should appear in the left panel.</p></div></div></div><div id="panel-import-export" role="tabpanel" class="tab-pane fade row"> <div class="col-xs-12 col-md-7 col-lg-9"><h1>Import</h1><iframe style="display:none"></iframe><form role="form" class="import"><h3>Import opml rss file or html bookmarks file containing feeds and exported from firefox or chrome</h3><input id="import-file" type="file" name="feeds-file" style="display:none"/><button type="submit" class="btn btn-default"> <span class="glyphicon glyphicon-cloud-upload"></span>IMPORT</button><div class="results"><span class="import-success label label-success">0</span><span class="import-failed label label-danger">0</span></div></form><h1>Export</h1><form role="form" class="import"><h3>Comming soon ...</h3></form></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"></div></div><div id="panel-settings" role="tabpanel" class="tab-pane fade row"><div class="ccol-xs-12 ol-md-7 col-lg-9"><h1>Settings</h1><form id="settings" role="form"></form></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"><div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>old links ?</div><p> \nI call "old" links the links that are still in the rss feed but that have been displayed before. </p><p> \nBy default, they are not displayed anymore following the "if you did not read it first time it does not interest you so much" rule. </p><p> \nCheck the "Show new and old links" parameter if you want to procrastinate or if a wrong click removed all links before you read them.</p></div></div></div><div id="panel-help" role="tabpanel" class="tab-pane fade"><div class="ccol-xs-12 ol-md-7 col-lg-9"><h1>Help<h3>How does it work? </h3><p>This is a tool to follow your rss/atom feeds without to much procrastinating.</p><p> \nThe idea behind zero-feeds is that if you do not read a link when you discover it, most of the time, it means that you are not so much interested in it (it\'s an "opinionated" feeds reader). So read it now or forget it. </p><p>In usual feed readers, the links are availables as long as they are provided by the websites, so you will first read what matters, then what looks interesing, then this stuff that is maybe the thing to read, then what is left, oh it\'s time to go to lunch ! No. I do not like this way of procrastination, so do not expect zero-feeds to help you to do that. </p><h3>Will you miss the news of the year ? </h3><p>No, if you did not click on it, you will hear about it from others. So what are you afraid to miss ? A good link ? Yes probably, but do not worry, there will be another good link tomorow.</p><h3>Does it scale for my 6000 feeds ? </h3><p>Seriously ? Reduce your amount of sites you follow, you have better to do today than reading all of them.</p><h3>How do I start ? </h3><p> \nProbably by adding a feed (check the tabs, I\'m sure you can find where to do that).</p><h3>I\'m not sure, how to add a feed ? </h3><p> \nJust click on the top "Add Feeds" button, fill the url and tags fields and click on the "Add Feed" button right next to the tags field (or hit the enter key in one of the fields).\nThe tags and the feed url should appear in the left panel.</p><h3>I want to change the tags of a feed, or I mistyped the url, how can I edit my feed ?</h3><p>Pass the mouse on the feed title and click on cross on left of the feed, don\'t worry, your feed will be removed, but the "Add Feed" form will be filled with its url and tags. Change what is wrong and add the feed again.</p><h3>I just see the beginning of the url of my feed, I feel unsatisfied.</h3><p>Now click on it. The title of this feed should replace its url and the link of this feed should be displayed.</p><h3>What are these "tags" ?</h3><p>They will be used to classify your feeds in the left panel.\nA click on a tag name will display all feeds tagged with it</p><h3>I don\'t want to reload all the feeds of a tag.</h3><p>Like me. So, just click on the tag name in the left panel, all feeds will be displayed, then click on the feed title you want to reload.</p><h3>The first time I clicked on a feed, the links of this feed have been displayed, now I clicked several times and there is no more links !</h3><p>You just need to click once. In fact, "reloading" a feed aims to display the new links of this feed since the last time you did reload it. So if you see nothing, it means that there is no new link to help you to procrastinate.</p><h3>I didn\'t visit all the links of a feed and I "reloaded" it, are the "old" links lost ?</h3><p>No, click on the "Settings" button at the top and check the "Show new and old links" checkbox, they should appear. </p><h3>In this "Settings" panel, there is a field called "Use quickmarks app to save links", what is it ?</h3><p> \nYou are curious, isn\'t it ? I like you. So, install the Quickmarks app that you can find in the Cozy Store\nThen you should see a "send to quickmarks" button on the left of the feed links, click on it, and this link will be added to your bookmarks in the quickmarks app.\nThis is a perfect world, but this feature is not implemented yet</p><h3>It still doesn\'t work !</h3><p> \nPlease <a href="https://github.com/pierrerousseau/zero-feeds/issues" target="_blank">add an issue</a> and help me to help you.</p><h3>I want to use only free softwares.</h3><p> <a href="https://github.com/pierrerousseau/zero-feeds" target="_blank">Me too</a>. \n I\'m not sure what licence I can use for a cozycloud app but you can consider my code under <a href="https://en.wikipedia.org/wiki/WTFPL" target="_blank">WTFPL</a>. </p></h1></div><div class="panel-tips hidden-xs col-md-5 col-lg-3"><div class="tip-issues"><div class="tip-title">Report a bug</div><p> \nPlease &nbsp;<a href="https://github.com/pierrerousseau/zero-feeds/issues" target="_blank">add an issue</a>&nbsp; and help me to help you.</p></div></div></div></div></div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/link", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<li');
buf.push(attrs({ "class": ("link " + (from) + " link-" + (state) + "") }, {"class":true}));
buf.push('><div class="panel panel-default"><div class="panel-heading"><h3 class="link-title panel-title"><a');
buf.push(attrs({ 'href':("" + (url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a></h3><a');
buf.push(attrs({ 'title':("send to Twitter"), 'href':("https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + ""), 'target':("_blank") }, {"title":true,"href":true,"target":true}));
buf.push('> <span class="fa fa-twitter"></span></a></div><div class="panel-body"><div class="link-infos"></div><div class="link-description">' + ((interp = description) == null ? '' : interp) + '</div></div><div class="panel-footer"><div class="link-buttons"><a');
buf.push(attrs({ 'href':("" + (url) + ""), 'target':("_blank"), "class": ("btn btn-default") }, {"class":true,"href":true,"target":true}));
buf.push('> <span class="glyphicon glyphicon-link"></span>Open and read now</a><a');
buf.push(attrs({ 'title':("send to Twitter"), 'href':("https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + ""), 'target':("_blank"), "class": ("btn btn-invert") }, {"class":true,"title":true,"href":true,"target":true}));
buf.push('> <span class="fa fa-twitter"></span>Share</a></div></div></div></li>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-add-feeds", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1 class="add-feed-title">Add a feed</h1><form role="form" class="add-one-feed"><div class="form-group"><label for="add-feed-url">Feed URL</label><input id="add-feed-url" name="add-feed-url" placeholder="http://" class="form-control"/></div><div class="form-group"><label for="add-feed-tags">Tags (separated by ", ")</label><input id="add-feed-tags" name="add-feed" placeholder="science, diy" class="form-control"/></div><button type="submit" class="btn btn-default"> <span class="glyphicon glyphicon-plus"></span>ADD FEED</button></form>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-help", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1>Help<h3>How does it work? </h3><p>This is a tool to follow your rss/atom feeds without to much procrastinating.</p><p> \nThe idea behind zero-feeds is that if you do not read a link when you discover it, most of the time, it means that you are not so much interested in it (it\'s an "opinionated" feeds reader). So read it now or forget it. </p><p>In usual feed readers, the links are availables as long as they are provided by the websites, so you will first read what matters, then what looks interesing, then this stuff that is maybe the thing to read, then what is left, oh it\'s time to go to lunch ! No. I do not like this way of procrastination, so do not expect zero-feeds to help you to do that. </p><h3>Will you miss the news of the year ? </h3><p>No, if you did not click on it, you will hear about it from others. So what are you afraid to miss ? A good link ? Yes probably, but do not worry, there will be another good link tomorow.</p><h3>Does it scale for my 6000 feeds ? </h3><p>Seriously ? Reduce your amount of sites you follow, you have better to do today than reading all of them.</p><h3>How do I start ? </h3><p> \nProbably by adding a feed (check the tabs, I\'m sure you can find where to do that).</p><h3>I\'m not sure, how to add a feed ? </h3><p> \nJust click on the top "Add Feeds" button, fill the url and tags fields and click on the "Add Feed" button right next to the tags field (or hit the enter key in one of the fields).\nThe tags and the feed url should appear in the left panel.</p><h3>I want to change the tags of a feed, or I mistyped the url, how can I edit my feed ?</h3><p>Pass the mouse on the feed title and click on cross on left of the feed, don\'t worry, your feed will be removed, but the "Add Feed" form will be filled with its url and tags. Change what is wrong and add the feed again.</p><h3>I just see the beginning of the url of my feed, I feel unsatisfied.</h3><p>Now click on it. The title of this feed should replace its url and the link of this feed should be displayed.</p><h3>What are these "tags" ?</h3><p>They will be used to classify your feeds in the left panel.\nA click on a tag name will display all feeds tagged with it</p><h3>I don\'t want to reload all the feeds of a tag.</h3><p>Like me. So, just click on the tag name in the left panel, all feeds will be displayed, then click on the feed title you want to reload.</p><h3>The first time I clicked on a feed, the links of this feed have been displayed, now I clicked several times and there is no more links !</h3><p>You just need to click once. In fact, "reloading" a feed aims to display the new links of this feed since the last time you did reload it. So if you see nothing, it means that there is no new link to help you to procrastinate.</p><h3>I didn\'t visit all the links of a feed and I "reloaded" it, are the "old" links lost ?</h3><p>No, click on the "Settings" button at the top and check the "Show new and old links" checkbox, they should appear. </p><h3>In this "Settings" panel, there is a field called "Use quickmarks app to save links", what is it ?</h3><p> \nYou are curious, isn\'t it ? I like you. So, install the Quickmarks app that you can find in the Cozy Store\nThen you should see a "send to quickmarks" button on the left of the feed links, click on it, and this link will be added to your bookmarks in the quickmarks app.\nThis is a perfect world, but this feature is not implemented yet</p><h3>It still doesn\'t work !</h3><p> \nPlease <a href="https://github.com/pierrerousseau/zero-feeds/issues" target="_blank">add an issue</a> and help me to help you.</p><h3>I want to use only free softwares.</h3><p> <a href="https://github.com/pierrerousseau/zero-feeds" target="_blank">Me too</a>. \n I\'m not sure what licence I can use for a cozycloud app but you can consider my code under <a href="https://en.wikipedia.org/wiki/WTFPL" target="_blank">WTFPL</a>. </p></h1>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-history", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1>Comming soon ...</h1>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-import-export", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1>Import</h1><iframe style="display:none"></iframe><form role="form" class="import"><h3>Import opml rss file or html bookmarks file containing feeds and exported from firefox or chrome</h3><input id="import-file" type="file" name="feeds-file" style="display:none"/><button type="submit" class="btn btn-default"> <span class="glyphicon glyphicon-cloud-upload"></span>IMPORT</button><div class="results"><span class="import-success label label-success">0</span><span class="import-failed label label-danger">0</span></div></form><h1>Export</h1><form role="form" class="import"><h3>Comming soon ...</h3></form>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-links", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="links-title"><h1>Links</h1><h3>new articles from your favorite feeds</h3></div><div class="links"></div>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-settings", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1>Settings</h1><form id="settings" role="form"></form>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-tips-add-feeds", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>Follow a new site ?</div><p> \nOn your favorite site find the "rss/atom" link.</p><p>Then, fill the url field with this link \nand the tag field with the categories \nthat you want to associtate to this feed.</p><p>Then click on the "Add Feed" button right next to the tags field \n(or hit the enter key in one of the fields).</p><p>The tags and the feed url should appear in the left panel.</p></div>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-tips-help", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tip-issues"><div class="tip-title">Report a bug</div><p> \nPlease &nbsp;<a href="https://github.com/pierrerousseau/zero-feeds/issues" target="_blank">add an issue</a>&nbsp; and help me to help you.</p></div>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-tips-settings", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>old links ?</div><p> \nI call "old" links the links that are still in the rss feed but that have been displayed before. </p><p> \nBy default, they are not displayed anymore following the "if you did not read it first time it does not interest you so much" rule. </p><p> \nCheck the "Show new and old links" parameter if you want to procrastinate or if a wrong click removed all links before you read them.</p></div>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-tips", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div class="tip-of-the-day"><div class="tip-title"> <img alt="poulpe" src="images/poulpe.svg" class="poulpe"/>Tip of the day</div><p>Zero-Feeds displays only the new links from your feeds, if you still want them, there is a parameter to change in the settings panel</p></div><div class="tip-questions"><div class="tip-title">Any question ?</div><p>Visit the help section to find out how zero-feeds works.</p></div>');
}
return buf.join("");
};
});

;require.register("views/templates/panel-welcome", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<h1 class="welcome-title"><img alt="poulpe" src="images/poulpe.svg" class="poulpe"/><p>Welcome to zero-feeds !</p></h1><div class="welcome-message"><p>This application is a RSS/Atom feeds reader designed to minimise the time lost reading them</p><p class="welcome-start">Start now !</p><div class="welcome-actions"><div class="welcome-add-feed btn btn-default">Add your first feed</div><div class="welcome-add-feeds btn btn-invert">Import a .opml file</div></div></div>');
}
return buf.join("");
};
});

;require.register("views/templates/param", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<label> ');
 if (model.value == "true")
{
buf.push('<input');
buf.push(attrs({ 'id':("settings-" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'checked':("checked"), 'value':("" + (model.value) + "") }, {"id":true,"name":true,"type":true,"checked":true,"value":true}));
buf.push('/>');
}
 else
{
buf.push('<input');
buf.push(attrs({ 'id':("settings-" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'value':("" + (model.value) + "") }, {"id":true,"name":true,"type":true,"value":true}));
buf.push('/>');
}
buf.push('' + escape((interp = model.description) == null ? '' : interp) + '</label>');
}
return buf.join("");
};
});

;require.register("views/templates/tag", function(exports, require, module) {
module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
var buf = [];
with (locals || {}) {
var interp;
buf.push('<div');
buf.push(attrs({ "class": ('tag') + ' ' + ("tag-close tag-" + (name) + "") }, {"class":true}));
buf.push('><div class="tag-title"><div class="tag-toggle"><span class="glyphicon glyphicon-chevron-right"></span><span class="glyphicon glyphicon-chevron-down"></span></div><div class="tag-name">' + escape((interp = name) == null ? '' : interp) + '</div><div class="tag-refresh"><span class="glyphicon glyphicon-refresh"></span></div></div><div class="tag-feeds"></div></div>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map