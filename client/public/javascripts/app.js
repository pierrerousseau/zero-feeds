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
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/feed_collection": function(exports, require, module) {
  var Feed, FeedCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Feed = require('../models/feed');

  module.exports = FeedCollection = (function(_super) {

    __extends(FeedCollection, _super);

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
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.CozyApp) == null) {
    this.CozyApp = {};
  }

  if ((_ref1 = CozyApp.Routers) == null) {
    CozyApp.Routers = {};
  }

  if ((_ref2 = CozyApp.Views) == null) {
    CozyApp.Views = {};
  }

  if ((_ref3 = CozyApp.Models) == null) {
    CozyApp.Models = {};
  }

  if ((_ref4 = CozyApp.Collections) == null) {
    CozyApp.Collections = {};
  }

  $(function() {
    var AppView;
    require('../lib/app_helpers');
    CozyApp.Views.appView = new (AppView = require('views/app_view'));
    CozyApp.Views.appView.render();
    return Backbone.history.start({
      pushState: true
    });
  });
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    return (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                     group,groupCollapsed,groupEnd,info,log,markTimeline,\
                     profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
  })();
  
}});

window.require.define({"lib/view": function(exports, require, module) {
  var View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.tagName = 'section';

    View.prototype.template = function() {};

    View.prototype.initialize = function() {
      return this.render();
    };

    View.prototype.getRenderData = function() {
      var _ref;
      return {
        model: (_ref = this.model) != null ? _ref.toJSON() : void 0
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

    return View;

  })(Backbone.View);
  
}});

window.require.define({"lib/view_collection": function(exports, require, module) {
  var View, ViewCollection, methods,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  ViewCollection = (function(_super) {

    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.renderAll = __bind(this.renderAll, this);

      this.renderOne = __bind(this.renderOne, this);
      return ViewCollection.__super__.constructor.apply(this, arguments);
    }

    ViewCollection.prototype.collection = new Backbone.Collection();

    ViewCollection.prototype.view = new View();

    ViewCollection.prototype.views = [];

    ViewCollection.prototype.length = function() {
      return this.views.length;
    };

    ViewCollection.prototype.add = function(views, options) {
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
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
      var view, _i, _len;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      for (_i = 0, _len = views.length; _i < _len; _i++) {
        view = views[_i];
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
      var view, _i, _j, _len, _len1, _ref;
      if (options == null) {
        options = {};
      }
      views = _.isArray(views) ? views.slice() : [views];
      _ref = this.views;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view = _ref[_i];
        this.destroy(view, options);
      }
      if (views.length !== 0) {
        for (_j = 0, _len1 = views.length; _j < _len1; _j++) {
          view = views[_j];
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
      this.$el.append(view.render().el);
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
  
}});

window.require.define({"models/feed": function(exports, require, module) {
  var Feed,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Feed = (function(_super) {

    __extends(Feed, _super);

    function Feed() {
      return Feed.__super__.constructor.apply(this, arguments);
    }

    Feed.prototype.urlRoot = 'feeds';

    Feed.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Feed;

  })(Backbone.Model);
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': function() {}
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var AppRouter, AppView, Feed, FeedsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  FeedsView = require('./feeds_view');

  Feed = require('../models/feed');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.onCreateClicked = __bind(this.onCreateClicked, this);

      this.onMoreClicked = __bind(this.onMoreClicked, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.events = {
      'click .icon-add': 'onCreateClicked',
      'click .icon-more': 'onMoreClicked',
      'click .icon-less': 'onMoreClicked'
    };

    AppView.prototype.template = function() {
      return require('./templates/home');
    };

    AppView.prototype.initialize = function() {
      return this.router = CozyApp.Routers.AppRouter = new AppRouter();
    };

    AppView.prototype.afterRender = function() {
      var _this = this;
      $(".url-field").focus();
      this.feedsView = new FeedsView();
      this.feedsView.$el.html('<em>loading...</em>');
      return this.feedsView.collection.fetch({
        success: function() {
          return _this.feedsView.$el.find('em').remove();
        }
      });
    };

    AppView.prototype.onMoreClicked = function(event) {
      $(".description-field").toggle();
      if ($(".icon-more").length > 0) {
        $(".icon-more").addClass("icon-less");
        $(".icon-more").removeClass("icon-more");
        $(".icon-less").attr("title", "less");
      } else {
        $(".icon-less").addClass("icon-more");
        $(".icon-less").removeClass("icon-less");
        $(".icon-more").attr("title", "more");
      }
      return false;
    };

    AppView.prototype.onCreateClicked = function(event) {
      var description, feed, tags, title, url,
        _this = this;
      url = $('.url-field').val();
      title = $('.title-field').val();
      tags = $('.tags-field').val().split(',').map(function(tag) {
        return $.trim(tag);
      });
      description = $('.description-field').val();
      if ((url != null ? url.length : void 0) > 0) {
        feed = new Feed({
          title: title,
          url: url
        });
        event.preventDefault();
        this.feedsView.collection.create(feed, {
          success: function() {
            return $("form.new-feed").find("input, textarea").val("");
          },
          error: function() {
            return alert("Server error occured, feed was not saved");
          }
        });
      } else {
        alert('Url field is required');
      }
      return false;
    };

    return AppView;

  })(View);
  
}});

window.require.define({"views/feed_view": function(exports, require, module) {
  var FeedView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = FeedView = (function(_super) {

    __extends(FeedView, _super);

    FeedView.prototype.className = 'feed';

    FeedView.prototype.tagName = 'div';

    FeedView.prototype.events = {
      'click': 'onUpdateClicked',
      'click .icon-delete': 'onDeleteClicked'
    };

    function FeedView(model) {
      this.model = model;
      this.link_template = require('./templates/link');
      FeedView.__super__.constructor.call(this);
    }

    FeedView.prototype.template = function() {
      var template;
      template = require('./templates/feed');
      return template(this.getRenderData());
    };

    FeedView.prototype.from = function() {
      var title;
      title = this.model.attributes.title;
      if (title) {
        return title.replace(/\s/g, "");
      } else {
        return "";
      }
    };

    FeedView.prototype.renderXml = function() {
      var $items, $xml, from, title, tmpl;
      $xml = $($.parseXML(this.model.attributes.content));
      title = $xml.find("channel > title:first").text();
      this.$el.find(".title a").html(title);
      $items = $xml.find("item").get();
      $items.reverse();
      from = this.from();
      tmpl = this.link_template;
      return $.each($items, function(index, value) {
        var link, url;
        title = $(value).find("title").text();
        url = $(value).find("link").text();
        link = {
          "title": title,
          "url": url,
          "from": from
        };
        $(".links").prepend(tmpl(link));
        if (index >= 9) {
          return false;
        }
      });
    };

    FeedView.prototype.onUpdateClicked = function(evt) {
      var $title, $xml, existing, from, spinner,
        _this = this;
      from = this.from();
      existing = [];
      if (from) {
        existing = $(".links ." + from);
      }
      spinner = new Spinner({
        "lines": 13,
        "length": 4,
        "width": 4,
        "radius": 6,
        "corners": 1,
        "rotate": 0,
        "color": '#27aaf2',
        "speed": 1,
        "trail": 60,
        "shadow": true,
        "hwaccel": false,
        "className": 'spinner',
        "top": 'auto',
        "left": 'auto'
      });
      spinner.spin(this.el);
      if (existing.length) {
        existing.remove();
        this.$el.removeClass("show");
        spinner.stop();
      } else {
        $xml = $($.parseXML(this.model.attributes.content));
        $title = $xml.find("channel > title:first").text();
        this.model.save({
          "title": $title
        }, {
          success: function() {
            _this.renderXml();
            _this.render();
            console.log(_this.$el);
            _this.$el.addClass("show");
            return spinner.stop();
          },
          error: function() {
            spinner.stop();
            return alert("Server error occured, feed was not deleted.");
          }
        });
      }
      return evt.preventDefault();
    };

    FeedView.prototype.onDeleteClicked = function(evt) {
      var _this = this;
      this.model.destroy({
        success: function() {
          var url;
          url = _this.$el.find(".title a").attr("href");
          $("form.new-feed .url-field").val(url);
          return _this.destroy();
        },
        error: function() {
          return alert("Server error occured, feed was not deleted.");
        }
      });
      evt.preventDefault();
      return false;
    };

    return FeedView;

  })(View);
  
}});

window.require.define({"views/feeds_view": function(exports, require, module) {
  var FeedCollection, FeedView, FeedsView, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  FeedView = require('./feed_view');

  FeedCollection = require('../collections/feed_collection');

  module.exports = FeedsView = (function(_super) {

    __extends(FeedsView, _super);

    function FeedsView() {
      this.renderOne = __bind(this.renderOne, this);
      return FeedsView.__super__.constructor.apply(this, arguments);
    }

    FeedsView.prototype.el = '.feeds';

    FeedsView.prototype.view = FeedView;

    FeedsView.prototype.renderOne = function(model) {
      var view;
      view = new this.view(model);
      this.$el.append(view.render().el);
      this.add(view);
      return this;
    };

    FeedsView.prototype.initialize = function() {
      return this.collection = new FeedCollection(this);
    };

    return FeedsView;

  })(ViewCollection);
  
}});

window.require.define({"views/templates/feed": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="title"><div class="buttons"><button class="icon-delete"></button></div>');
  if ( model.title)
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("" + (model.url) + "") }, {"href":true}));
  buf.push('>' + escape((interp = model.title) == null ? '' : interp) + '</a>');
  }
  else
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("" + (model.url) + "") }, {"href":true}));
  buf.push('>' + escape((interp = model.url) == null ? '' : interp) + '</a>');
  }
  buf.push('</div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div id="content"><h1>My Cozy Feeds</h1><form class="new-feed"><p><input placeholder="url" class="url-field"/><input placeholder="title" class="title-field"/><input placeholder="tags, separated by \',\'" class="tags-field"/><input type="button" title="more" class="icon-more"/></p><p><textarea placeholder="description" class="description-field"></textarea></p><button title="add" class="icon-add"></button></form><div class="feeds"></div><ul class="links"></ul></div>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/link": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<li');
  buf.push(attrs({ "class": ("" + (from) + "") }, {"class":true}));
  buf.push('><a');
  buf.push(attrs({ 'href':("" + (url) + "") }, {"href":true}));
  buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a></li>');
  }
  return buf.join("");
  };
}});

