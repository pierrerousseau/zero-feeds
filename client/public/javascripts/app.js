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
        console.log("kikoo", cb);
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
        if (last && url === last) {
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
          "url": url,
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
    this.toCozyBookMarks = bind(this.toCozyBookMarks, this);
    this.updateSettings = bind(this.updateSettings, this);
    this.addFeed = bind(this.addFeed, this);
    return AppView.__super__.constructor.apply(this, arguments);
  }

  AppView.prototype.el = 'body.application';

  AppView.prototype.template = function() {
    return require('./templates/home');
  };

  AppView.prototype.events = {
    "click .menu-new": "displayNewForm",
    "click .menu-help": "toggleHelp",
    "click .menu-settings": "toggleSettings",
    "click .menu-import": "import",
    "change #feeds-file": "uploadFile",
    "submit form.new-feed": "addFeed",
    "keyup #param-cozy-bookmarks-name": "updateSettings",
    "change #param-show-new-links": "toggleOldLinks",
    "click .link-send-to-cozy-bookmarks": "toCozyBookMarks",
    "click .link": "linkDetails"
  };

  AppView.prototype.startWaiter = function($elem) {
    var html;
    html = "<img " + "src='images/loader.gif' " + "class='main loader' " + "alt='loading ...' />";
    return $elem.append(html);
  };

  AppView.prototype.stopWaiter = function($elem) {
    return $elem.find(".main.loader").remove();
  };

  AppView.prototype.toggleOldLinks = function(evt) {
    $("ul.links").toggleClass("show-old");
    this.updateSettings(evt);
    return false;
  };

  AppView.prototype.applyParameters = function(parameters) {
    var i, len, parameter, results;
    results = [];
    for (i = 0, len = parameters.length; i < len; i++) {
      parameter = parameters[i];
      if (parameter.paramId === "show-new-links") {
        if (parameter.value === "false") {
          this.toggleOldLinks();
          break;
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  AppView.prototype.afterRender = function() {
    this.feedsView = new FeedsView();
    this.startWaiter(this.feedsView.$el);
    this.feedsView.collection.fetch({
      success: (function(_this) {
        return function() {
          return _this.stopWaiter(_this.feedsView.$el);
        };
      })(this)
    });
    this.paramsView = new ParamsView();
    this.startWaiter(this.paramsView.$el);
    this.paramsView.collection.fetch({
      success: (function(_this) {
        return function(view, parameters) {
          _this.applyParameters(parameters);
          return _this.stopWaiter(_this.paramsView.$el);
        };
      })(this)
    });
    if ($(".feeds").width() / $("body").width() < 10) {
      return $(".feeds").css("max-width", "17em");
    }
  };

  AppView.prototype.initialize = function() {
    return this.router = CozyApp.Routers.AppRouter = new AppRouter();
  };

  AppView.prototype.hideToggled = function() {
    $(".new-feed").slideUp();
    $("div.help").slideUp();
    $("form.settings").slideUp();
    return $(".menu-buttons .active").removeClass('active');
  };

  AppView.prototype.displayNewForm = function() {
    this.hideToggled();
    if (!$(".new-feed").is(':visible')) {
      $(".menu-new").addClass('active');
      $(".new-feed").slideDown();
      $(".new-feed-url").focus();
    }
    return false;
  };

  AppView.prototype.toggleHelp = function() {
    this.hideToggled();
    if (!$("div.help").is(':visible')) {
      $(".menu-buttons .btn.help").addClass('active');
      $("div.help").slideDown();
    }
    return false;
  };

  AppView.prototype.toggleSettings = function() {
    this.hideToggled();
    if (!$("form.settings").is(':visible')) {
      $(".menu-buttons .btn.cog").addClass('active');
      $("form.settings").slideDown();
    }
    return false;
  };

  AppView.prototype.cleanAddFeedForm = function() {
    return $("form.new-feed").find("input").val("");
  };

  AppView.prototype.cleanAddFeedForm = function() {
    return $("form.new-feed").find("input").val("");
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
          var elems;
          elems = $("." + elem.cid);
          elems.parents(".tag").find(".feed").show();
          _this.cleanAddFeedForm();
          return elems.not(".clone").click();
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
    url = $('.new-feed-url').val();
    tags = $('.new-feed-tags').val().split(',').map(function(tag) {
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

  AppView.prototype.updateSettings = function(evt) {
    var $elem, app, checked, i, len, name, paramId, parameter, ref;
    if (!evt) {
      return false;
    }
    ref = this.paramsView.collection.models;
    for (i = 0, len = ref.length; i < len; i++) {
      parameter = ref[i];
      paramId = "param-" + parameter.attributes.paramId;
      name = parameter.attributes.name;
      $elem = $("#" + paramId);
      if (paramId === "param-show-new-links" && paramId === evt.target.id) {
        checked = $elem.prop("checked");
        parameter.save({
          "value": checked
        }, {
          success: function() {
            return View.log(name + " saved");
          },
          error: function() {
            return View.error(name + " not saved");
          }
        });
        break;
      } else if (paramId === evt.target.id) {
        app = $elem.val();
        if (this.settingsSaveTimer != null) {
          clearTimeout(this.settingsSaveTimer);
        }
        this.settingsSaveTimer = setTimeout((function() {
          return parameter.save({
            "value": app
          }, {
            success: function() {
              return View.log(name + " saved");
            },
            error: function() {
              return View.error(name + " not saved");
            }
          });
        }), 1000);
        break;
      }
    }
    return false;
  };

  AppView.prototype.toCozyBookMarks = function(evt) {
    var ajaxOptions, url;
    console.log("oooooo");
    url = $(evt.target).parents(".link:first").find("> a").attr("href");
    ajaxOptions = {
      type: "POST",
      url: "../../apps/" + $("#param-cozy-bookmarks-name").val() + "/bookmarks",
      data: {
        url: url,
        tags: ["cozy-feeds"]
      },
      success: function() {
        return View.log("link added to cozy-bookmarks");
      },
      error: function() {
        return View.error("link wasn't added to cozy-bookmarks");
      }
    };
    $.ajax(ajaxOptions);
    return false;
  };

  AppView.prototype.linkDetails = function(evt) {
    var link;
    link = $(evt.currentTarget);
    link.toggleClass("link-active");
    link.find(".link-view-description").toggleClass("link-active");
    return link.find(".link-description").toggle();
  };

  AppView.prototype.addFeedFromFile = function(feedObj) {
    var feed;
    feed = new Feed(feedObj);
    return this.feedsView.collection.create(feed, {
      success: (function(_this) {
        return function(elem) {
          var imported;
          imported = $(".imported");
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
    return file.type !== "text/html" && file.type !== "text/xml" && file.type !== "text/x-opml+xml";
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
    return View.confirm("Import opml rss file or " + "html bookmarks file containing feeds exported by " + "firefox or chrome", function() {
      return $("#feeds-file").click();
    });
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
    return this.$el.addClass("loading");
  };

  FeedView.prototype.stopWaiter = function() {
    return this.$el.removeClass("loading");
  };

  FeedView.prototype.setToDelete = function() {
    return this.$el.addClass("to-delete");
  };

  FeedView.prototype.setToNotDelete = function() {
    return this.$el.removeClass("to-delete");
  };

  FeedView.prototype.addToTag = function(tag) {
    var elem, exists, tagPlace, tmpl;
    tmpl = tagTemplate;
    tag = tag || "untagged";
    tagPlace = $("." + tag);
    if (tagPlace.length === 0) {
      tagPlace = $(tmpl({
        "name": tag
      }));
      $("#content .feeds").append(tagPlace);
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
      return tagPlace.find(".tag-header").after(elem);
    }
  };

  FeedView.prototype.setCount = function() {
    var count;
    count = this.model.count();
    if (count) {
      return this.$el.find(".feed-count").html("(" + count + ")");
    } else {
      return this.$el.find(".feed-count").html("");
    }
  };

  FeedView.prototype.setUpdate = function() {
    if (this.$el.is(":visible")) {
      this.startWaiter();
      this.model.save({
        "content": ""
      }, {
        success: (function(_this) {
          return function() {
            _this.stopWaiter();
            _this.setCount();
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

  FeedView.prototype.onUpdateClicked = function(evt) {
    var $allThat, error, existingLinks, title;
    this.startWaiter();
    evt.preventDefault();
    $allThat = $("." + this.model.cid);
    existingLinks = $(".links ." + this.feedClass() + ", .link" + this.model.cid);
    if (existingLinks.length) {
      existingLinks.remove();
      $allThat.removeClass("showing");
      this.setCount();
      this.stopWaiter();
    } else {
      try {
        title = this.model.titleText();
      } catch (_error) {
        error = _error;
        this.stopWaiter();
        View.error("Can't parse feed, please check feed address.");
        return false;
      }
      $allThat.addClass("showing");
      this.model.save({
        "title": title,
        "content": ""
      }, {
        success: (function(_this) {
          return function() {
            var last;
            _this.stopWaiter();
            _this.renderXml();
            title = _this.model.titleText();
            if (title) {
              last = _this.model.last;
              _this.model.save({
                "title": title,
                "last": last,
                "content": ""
              });
              $allThat.find("a").html(title);
              return View.log("" + title + " reloaded");
            }
          };
        })(this),
        error: (function(_this) {
          return function() {
            _this.stopWaiter();
            return View.error("Server error occured, feed was not updated.");
          };
        })(this)
      });
    }
    return false;
  };

  FeedView.prototype.refillAddForm = function() {
    var tags, title, url;
    title = this.$el.find(".feed-title");
    url = title.attr("href");
    tags = title.attr("data-tags") || "";
    $("form.new-feed .new-feed-url").val(url);
    $("form.new-feed .new-feed-tags").val(tags);
    if (!$('.new-feed').is(':visible')) {
      return $('.menu-new').trigger('click');
    }
  };

  FeedView.prototype.fullRemove = function() {
    var existingLinks, myTag;
    myTag = this.$el.parents(".tag");
    if (myTag.find(".feed").length === 1) {
      myTag.remove();
    }
    this.destroy();
    existingLinks = $(".links ." + this.feedClass() + ", .link" + this.model.cid);
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

  FeedsView.prototype.el = '.feeds';

  FeedsView.prototype.view = FeedView;

  FeedsView.prototype.events = {
    "click .tag": "onTagClicked",
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

  FeedsView.prototype.onReloadTagClicked = function(evt) {
    var feeds, target;
    target = $(evt.currentTarget).parents(".tag:first");
    feeds = target.find(".feed");
    feeds.trigger("click");
    return false;
  };

  FeedsView.prototype.onTagClicked = function(evt) {
    var feed, feeds, i, len, target;
    target = $(evt.currentTarget);
    feeds = target.find(".feed");
    target.toggleClass("active");
    target.find(".feed").toggle();
    target.find(".feed.showing").click();
    target.find(".feed.show .feed-title").toggle();
    for (i = 0, len = feeds.length; i < len; i++) {
      feed = feeds[i];
      $(feed).find(".feed-count").click();
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

View = require('../lib/view');

module.exports = ParamView = (function(superClass) {
  extend(ParamView, superClass);

  ParamView.prototype.className = 'param';

  ParamView.prototype.tagName = 'div';

  function ParamView(model) {
    this.model = model;
    ParamView.__super__.constructor.call(this);
  }

  ParamView.prototype.template = function() {
    var template;
    template = require('./templates/param');
    return template(this.getRenderData());
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

  ParamsView.prototype.el = '.settings .values';

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
buf.push('<div class="feed-spinner"><img src="images/loader.gif" alt="..." class="loader"/></div><span title="remove this feed and place its details on the new feed form" class="feed-delete">&times;</span><span class="feed-count"></span><a');
buf.push(attrs({ 'title':(title), 'data-tags':("" + (model.tags) + ""), 'href':("" + (model.url) + ""), "class": ('feed-title') }, {"title":true,"data-tags":true,"href":true}));
buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a>');
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
buf.push('<div id="content"><div class="contents"><div class="menu"><div class="clearfix import-file"><input type="file" name="feeds-file" id="feeds-file"/><span class="import"><p class="imported"></p><p class="imported-failed"></p></span></div><div class="menu-buttons"><button title="add a feed" class="btn glyphicon glyphicon-plus-sign menu-new"></button><button title="settings" class="btn glyphicon glyphicon-cog menu-settings"></button><button title="import opml rss files or html bookmarks files exported from your browser" class="btn glyphicon glyphicon-upload menu-import"></button><button title="help" class="btn glyphicon glyphicon-question-sign menu-help"></button></div><div class="feeds"></div></div><div class="main"><div class="options"><form class="panel panel-default new-feed"><div class="panel-heading"><h3 class="panel-title">Add a feed</h3></div><div class="panel-body"><div class="row"><div class="form-group col-xs-5"><input name="url-field" placeholder="url" class="form-control new-feed-url"/></div><div class="form-group col-xs-5"><input name="tags-field" placeholder="tags, separated by \',\'" class="form-control new-feed-tags"/></div><div class="col-xs-2 buttons"><button title="add the feed" class="btn glyphicon glyphicon-plus-sign new-feed-add"></button></div></div></div></form><form class="panel panel-default settings"><div class="panel-heading"><h3 class="panel-title">Settings</h3></div><div class="panel-body"><div class="row values"></div></div></form><div class="panel panel-default help"><div class="panel-heading"><h3>Help</h3></div><div class="panel-body"><h4>This is a tool to follow your rss/atom feeds.</h4><h5>How do I start ? </h5><p> \nPlease put your mouse over the icons that you see, a tooltip should help you.</p><h5>I\'m not sure, how to add a feed ? </h5><p> \nJust click on the top left "add a feed" button, fill the url and tags fields and click on the "add" button right next to the tags field (or hit the enter key in one of the field).\nThe tags and the feed url should appear in the left panel.</p><h5>I want to change the tags of a feed, or I mistyped the url, how can I edit my feed ?</h5><p>Pass the mouse on the feed title and click on cross on left of the feed, don\'t worry, your feed will be removed, but the "add a tag" form will be filled with its url and tags. Change what is wrong and add the feed again.</p><h5>I just see the beginning of the url of my feed, I feel unsatisfied.</h5><p>Now click on it. The title of this feed should replace its url and the link of this feed should be displayed.</p><h5>What are these "tags" ?</h5><p>They will be used to classify your feeds in the left panel.\nA click on a tag name will display all feeds tagged with it</p><h5>I don\'t want to reload all the feeds of a tag.</h5><p>Like me. So, just click on the tag name in the left panel, all feeds will be displayed, then click on the feed title you want to reload.</p><h5>The first time I clicked on a feed, the links of this feed have been displayed, now I clicked several times and there is no more links !</h5><p>You just need to click once. In fact, "reloading" a feed aims to display the new links of this feed since the last time you did reload it. So if you see nothing, it means that there is no new link to help you to procrastinate.</p><h5>I didn\'t visit all the links of a feed and I "reloaded" it, are the "old" links lost ?</h5><p>No, click on the "settings" button on the top right and uncheck the "Display only new links" checkbox, they should appear. </p><h5>In this "settings" panel, there is a field called "Cozy bookmarks application name", what is it ?</h5><p> \nYou are curious, isn\'t it ? I like you. So, install <a href="https://github.com/Piour/cozy-bookmarks" target="_blank">the cozy bookmarks app</a> and put there the name you gave to it (usually "bookmarks"). Then you should see a "send to cozy bookmarks" button on the left of the feed links, click on it, and this link will be added to your bookmarks in the cozy-bookmarks app.</p><h5>It still doesn\'t work !</h5><p> \nPlease <a href="https://github.com/Piour/cozy-feeds/issues" target="_blank">add an issue</a> and help me to help you.</p><h5>I want to use only free softwares.</h5><p> <a>Me too</a>. \n I\'m not sure what licence I can use using cozycloud but you can consider my code under <a href="https://en.wikipedia.org/wiki/WTFPL">WTFPL</a>. </p></div></div></div><ul class="links"></ul></div></div></div>');
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
buf.push('><div class="link-buttons"><a');
buf.push(attrs({ 'title':("send to tweeter"), 'href':("https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + ""), 'target':("_blank"), "class": ('btn') + ' ' + ("link-send-to-tweeter") }, {"class":true,"title":true,"href":true,"target":true}));
buf.push('><span class="fa fa-twitter"></span></a>');
if ( toCozyBookMarks)
{
buf.push('<button title="send to cozy bookmarks" class="btn link-send-to-cozy-bookmarks"><span class="glyphicon glyphicon-bookmark"></span></button>');
}
buf.push('<button title="view description" class="btn link-view-description"><span class="glyphicon glyphicon-plus"></span></button></div><a');
buf.push(attrs({ 'href':("" + (url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a><div class="link-description">' + ((interp = description) == null ? '' : interp) + '</div></li>');
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
 if (model.paramId == "show-new-links")
{
buf.push('<div class="checkbox"><label');
buf.push(attrs({ 'for':("param-" + (model.paramId) + "") }, {"for":true}));
buf.push('>');
 if (model.value == "true")
{
buf.push('<input');
buf.push(attrs({ 'id':("param-" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'checked':("checked"), 'value':("" + (model.value) + ""), "class": ('form-control') }, {"id":true,"name":true,"type":true,"checked":true,"value":true}));
buf.push('/>');
}
 else
{
buf.push('<input');
buf.push(attrs({ 'id':("param-" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'value':("" + (model.value) + ""), "class": ('form-control') }, {"id":true,"name":true,"type":true,"value":true}));
buf.push('/>');
}
buf.push('' + escape((interp = model.name) == null ? '' : interp) + '</label></div>');
}
 else
{
buf.push('<div class="form-group"><input');
buf.push(attrs({ 'id':("param-" + (model.paramId) + ""), 'placeholder':("" + (model.name) + ""), 'name':("" + (model.paramId) + ""), 'value':("" + (model.value) + ""), "class": ('form-control') }, {"id":true,"placeholder":true,"name":true,"value":true}));
buf.push('/></div>');
}
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
buf.push(attrs({ "class": ("tag " + (name) + "") }, {"class":true}));
buf.push('><div class="tag-header"><span class="tag-actions"><button title="reload all feeds" class="btn glyphicon glyphicon-refresh tag-refresh"></button></span><button class="tag-name">' + escape((interp = name) == null ? '' : interp) + '</button></div></div>');
}
return buf.join("");
};
});

;
//# sourceMappingURL=app.js.map