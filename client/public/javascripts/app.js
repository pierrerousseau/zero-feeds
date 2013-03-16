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

window.require.define({"collections/param_collection": function(exports, require, module) {
  var Param, ParamCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Param = require('../models/param');

  module.exports = ParamCollection = (function(_super) {

    __extends(ParamCollection, _super);

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

    Feed.prototype.feedClass = function() {
      var title;
      title = $.trim(this.attributes.title);
      if (title) {
        return title.replace(/[\s!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~]/g, '');
      } else {
        return "none";
      }
    };

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

    Feed.prototype.links = function() {
      var from, last, link, that, toCozyBookMarks, _i, _len, _links;
      _links = [];
      from = this.feedClass();
      toCozyBookMarks = $(".cozy-bookmarks-name").val();
      that = this;
      $.each(this.$items(), function(index, value) {
        var description, link, title, url;
        title = $(value).find("title").text();
        if (that.isAtom()) {
          url = $(value).find("id").text();
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
        link = {
          "title": title,
          "encodedTitle": encodeURIComponent(title),
          "url": url,
          "from": from,
          "toCozyBookMarks": toCozyBookMarks,
          "state": "old",
          "description": description
        };
        if (index === 0) {
          that.last = link.url;
        }
        return _links.push(link);
      });
      last = this.attributes.last;
      for (_i = 0, _len = _links.length; _i < _len; _i++) {
        link = _links[_i];
        if (link.url === last) {
          break;
        }
        link.state = "new";
      }
      return _links;
    };

    Feed.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Feed;

  })(Backbone.Model);
  
}});

window.require.define({"models/param": function(exports, require, module) {
  var Param,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Param = (function(_super) {

    __extends(Param, _super);

    function Param() {
      return Param.__super__.constructor.apply(this, arguments);
    }

    Param.prototype.urlRoot = 'params';

    Param.prototype.isNew = function() {
      return !(this.id != null);
    };

    return Param;

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
  var AppRouter, AppView, Feed, FeedsView, ParamsView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  AppRouter = require('../routers/app_router');

  FeedsView = require('./feeds_view');

  ParamsView = require('./params_view');

  Feed = require('../models/feed');

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      this.updateSettings = __bind(this.updateSettings, this);

      this.addFeed = __bind(this.addFeed, this);
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.events = {
      "click h1": "showOnlyTitle",
      "click .icon-new": "displayNewForm",
      "click .icon-help": "displayHelp",
      "click .icon-settings": "displaySettings",
      "click form.new-feed .icon-add": "addFeed",
      "click form.settings .icon-update": "updateSettings",
      "change #show-new-links": "showLinks"
    };

    AppView.prototype.template = function() {
      return require('./templates/home');
    };

    AppView.prototype.initialize = function() {
      return this.router = CozyApp.Routers.AppRouter = new AppRouter();
    };

    AppView.prototype.showOnlyTitle = function() {
      $(".new-feed").hide();
      $(".settings").hide();
      return $(".help").hide();
    };

    AppView.prototype.displayHelp = function() {
      $(".help").toggle("slow");
      return false;
    };

    AppView.prototype.displayNewForm = function() {
      $(".new-feed").show("slow");
      return false;
    };

    AppView.prototype.displaySettings = function() {
      $(".settings").toggle("slow");
      return false;
    };

    AppView.prototype.afterRender = function() {
      var _this = this;
      $(".url-field").focus();
      this.feedsView = new FeedsView();
      this.feedsView.$el.html('<em>loading...</em>');
      this.feedsView.collection.fetch({
        success: function() {
          return _this.feedsView.$el.find('em').remove();
        }
      });
      this.paramsView = new ParamsView();
      this.paramsView.$el.html('<em>loading...</em>');
      return this.paramsView.collection.fetch({
        success: function(view, col) {
          var param, _i, _len, _results;
          _this.paramsView.$el.find('em').remove();
          _results = [];
          for (_i = 0, _len = col.length; _i < _len; _i++) {
            param = col[_i];
            if (param.paramId === "show-new-links" && !param.value) {
              _results.push(_this.showLinks());
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      });
    };

    AppView.prototype.addFeed = function(event) {
      var feed, tags, url,
        _this = this;
      url = $('.url-field').val();
      tags = $('.tags-field').val().split(',').map(function(tag) {
        return $.trim(tag);
      });
      if ((url != null ? url.length : void 0) > 0) {
        feed = new Feed({
          url: url,
          tags: tags
        });
        event.preventDefault();
        this.feedsView.collection.create(feed, {
          success: function() {
            alertify.log("" + url + " added");
            return $("form.new-feed").find("input").val("");
          },
          error: function() {
            return alertify.alert("Server error occured, " + "feed was not added");
          }
        });
      } else {
        alertify.alert("Url field is required");
      }
      return false;
    };

    AppView.prototype.showLinks = function(evt) {
      $("ul.links").toggleClass("show-old");
      $("button.show-new").toggle();
      $("button.show-old").toggle();
      return false;
    };

    AppView.prototype.updateSettings = function(event) {
      var checked, param, _i, _len, _ref;
      _ref = this.paramsView.collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        if (param.attributes.paramId === "show-new-links") {
          checked = $("." + param.attributes.paramId).attr("checked");
          param.attributes.value = checked !== void 0;
        } else {
          param.attributes.value = $("." + param.attributes.paramId).val();
        }
        param.save();
      }
      return false;
    };

    return AppView;

  })(View);
  
}});

window.require.define({"views/feed_view": function(exports, require, module) {
  var FeedView, View, linkTemplate, tagTemplate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  linkTemplate = require('./templates/link');

  tagTemplate = require('./templates/tag');

  module.exports = FeedView = (function(_super) {

    __extends(FeedView, _super);

    FeedView.prototype.className = 'feed';

    FeedView.prototype.tagName = 'div';

    function FeedView(model) {
      this.model = model;
      FeedView.__super__.constructor.call(this);
    }

    FeedView.prototype.template = function() {
      var template;
      template = require('./templates/feed');
      return template(this.getRenderData());
    };

    FeedView.prototype.startWaiter = function(elem) {
      return $(elem).find(".buttons").append("<img " + " src='images/loader.gif'" + " class='loader'" + " alt='loading ...' />");
    };

    FeedView.prototype.stopWaiter = function(elem) {
      return $(elem).find(".loader").remove();
    };

    FeedView.prototype.renderXml = function() {
      var $items, links, tmpl;
      $items = this.model.$items();
      tmpl = linkTemplate;
      links = this.model.links();
      if (!links.length) {
        alertify.alert("No link found, are you sure this is a feed url ?");
        return;
      }
      links.reverse();
      return $.each(links, function(index, link) {
        var linkElem;
        linkElem = $(tmpl(link));
        linkElem.find(".to-cozy-bookmarks").click(function(evt) {
          var ajaxOptions, icon;
          icon = $(this);
          ajaxOptions = {
            type: "POST",
            url: "../../apps/" + link.toCozyBookMarks + "/bookmarks",
            data: {
              url: link.url,
              tags: "cozy-feeds"
            },
            success: function() {
              return alertify.log("link added to cozy-bookmarks");
            },
            error: function() {
              return alertify.alert("link wasn't added to cozy-bookmarks");
            }
          };
          $.ajax(ajaxOptions);
          return false;
        });
        linkElem.find("button.icon-more").click(function(evt) {
          var icon;
          icon = $(this);
          icon.toggleClass("icon-more");
          icon.toggleClass("icon-less");
          return linkElem.find(".description").toggle();
        });
        return $(".links").prepend(linkElem);
      });
    };

    FeedView.prototype.onUpdateClicked = function(evt, full) {
      var allThat, existing, that, title,
        _this = this;
      that = evt.currentTarget;
      allThat = $("." + this.model.cid);
      this.startWaiter(that);
      existing = $(".links ." + this.model.feedClass());
      $(".none").remove();
      if (existing.length) {
        existing.remove();
        $(allThat).removeClass("show");
        this.stopWaiter(that);
      } else {
        try {
          title = this.model.titleText();
        } catch (error) {
          this.stopWaiter(that);
          alertify.alert("Can't parse feed, please check feed address." + "no redirection, valid feed, ...");
        }
        this.model.save({
          "title": title
        }, {
          success: function() {
            var last;
            _this.renderXml();
            _this.model.attributes.title = _this.model.titleText();
            _this.render();
            $(allThat).find("a").html(_this.model.titleText());
            $(allThat).addClass("show");
            _this.stopWaiter(that);
            alertify.log("" + _this.$el.find(".title span").html() + " reloaded");
            last = _this.model.last;
            title = _this.model.titleText();
            return _this.model.save({
              "title": title,
              "last": last
            });
          },
          error: function() {
            _this.stopWaiter(that);
            return alertify.alert("Server error occured, feed was not updated.");
          }
        });
      }
      evt.preventDefault();
      return false;
    };

    FeedView.prototype.onDeleteClicked = function(evt) {
      var that,
        _this = this;
      that = evt.currentTarget;
      this.model.destroy({
        success: function() {
          var myTag, tags, title, url;
          title = _this.$el.find(".title");
          url = title.find("a").attr("href");
          tags = title.find("span").attr("title");
          if (!tags) {
            tags = "";
          }
          $("form.new-feed .url-field").val(url);
          $("form.new-feed .tags-field").val(tags);
          $(".icon-new").click();
          myTag = $(that).parents(".tag");
          if (myTag.find(".feed").length === 1) {
            myTag.remove();
          }
          _this.destroy();
          return alertify.log("" + _this.$el.find(".title span").html() + " removed and placed in form");
        },
        error: function() {
          return alertify.alert("Server error occured, feed was not deleted.");
        }
      });
      evt.preventDefault();
      return false;
    };

    FeedView.prototype.render = function() {
      var exists, tag, tagNumber, tagPlace, tags, that, tmpl, toDisplay, _i, _len;
      this.$el.html(this.template({}));
      this.$el.addClass(this.model.cid);
      tags = this.model.attributes.tags;
      if (!tags) {
        tags = ["untagged"];
      }
      tmpl = tagTemplate;
      tagNumber = 0;
      for (_i = 0, _len = tags.length; _i < _len; _i++) {
        tag = tags[_i];
        if (tag === "") {
          tag = "untagged";
        }
        tagPlace = $("." + tag);
        if (tagPlace.length === 0) {
          tagPlace = $(tmpl({
            "name": tag
          }));
          $("#content .feeds").append(tagPlace);
        }
        toDisplay = this.$el.clone(true, true);
        that = this;
        toDisplay.on("click", "", function(evt) {
          return that.onUpdateClicked(evt);
        });
        toDisplay.on("click", ".icon-delete", function(evt) {
          return that.onDeleteClicked(evt);
        });
        exists = tagPlace.find("." + this.model.cid);
        if (exists.length) {
          exists.replaceAll(toDisplay);
        } else {
          tagPlace.append(toDisplay);
          if (this.model.isNew()) {
            tagPlace.find(".feed").show();
          }
        }
        tagNumber++;
        this.$el.hide();
      }
      return this;
    };

    FeedView.prototype.destroy = function() {
      this.undelegateEvents();
      this.$el.removeData().unbind();
      $("." + this.model.cid).remove();
      this.remove();
      return Backbone.View.prototype.remove.call(this);
    };

    return FeedView;

  })(View);
  
}});

window.require.define({"views/feeds_view": function(exports, require, module) {
  var FeedCollection, FeedView, FeedsView, ViewCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  FeedView = require('./feed_view');

  FeedCollection = require('../collections/feed_collection');

  module.exports = FeedsView = (function(_super) {

    __extends(FeedsView, _super);

    function FeedsView() {
      return FeedsView.__super__.constructor.apply(this, arguments);
    }

    FeedsView.prototype.el = '.feeds';

    FeedsView.prototype.view = FeedView;

    FeedsView.prototype.events = {
      "click .tag": "onTagClicked",
      "click .tag .icon-reload": "onReloadTagClicked"
    };

    FeedsView.prototype.onReloadTagClicked = function(evt) {
      var feeds;
      feeds = $(evt.currentTarget).parents("div:first").find(".feed");
      feeds.show(function() {
        return $(this).click();
      });
      return false;
    };

    FeedsView.prototype.onTagClicked = function(evt) {
      $(evt.currentTarget).find(".feed").toggle();
      return false;
    };

    FeedsView.prototype.initialize = function() {
      return this.collection = new FeedCollection(this);
    };

    return FeedsView;

  })(ViewCollection);
  
}});

window.require.define({"views/param_view": function(exports, require, module) {
  var ParamView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('../lib/view');

  module.exports = ParamView = (function(_super) {

    __extends(ParamView, _super);

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
  
}});

window.require.define({"views/params_view": function(exports, require, module) {
  var ParamCollection, ParamView, ParamsView, ViewCollection,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('../lib/view_collection');

  ParamView = require('./param_view');

  ParamCollection = require('../collections/param_collection');

  module.exports = ParamsView = (function(_super) {

    __extends(ParamsView, _super);

    function ParamsView() {
      this.renderOne = __bind(this.renderOne, this);
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
  
}});

window.require.define({"views/templates/feed": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="title"><div class="buttons"><button title="remove this feed and place its details on the new feed form" class="icon-delete"><img src="icons/delete.png" alt="delete"/></button></div><span');
  buf.push(attrs({ 'title':("" + (model.tags) + "") }, {"title":true}));
  buf.push('>');
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
  buf.push('</span></div>');
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
  buf.push('<div id="content"><div class="main-title"><h1>My Cozy Feeds<div class="buttons"><button title="add a feed" class="icon-new"><img src="icons/new.png" alt="new"/></button><button title="help" class="icon-help"><img src="icons/help.png" alt="help"/></button><button title="settings" class="icon-settings"><img src="icons/settings.png" alt="settings"/></button></div></h1><form class="new-feed"><h2>add a feed</h2><p><input placeholder="url" class="url-field"/><input placeholder="tags, separated by \',\'" class="tags-field"/><span class="buttons"><button title="add" class="icon-add"><img src="icons/add.png" alt="add"/></button></span></p></form><form class="settings"><h2>settings<div class="buttons"><button title="update" class="icon-update"><img src="icons/validate.png" alt="update"/></button></div></h2><div class="values"></div></form><div class="help"><h4>This is a tool to follow your rss/atom feeds.</h4><p> <h5>How do I start ? </h5>Please put your mouse over the icons that you see, a tooltip should help you.</p><p> <h5>I\'m not sure, how to add a feed ? </h5>Just click on the top right "add a feed" button, fill the url and tags fields and click on the "add" button right next to the tags field (or hit the enter key in one of the field).\nThe tags and the feed url should appear in the right panel.</p><p><h5>I want to change the tags of a feed, or I mistyped the url, how can I edit my feed ?</h5>Just click on red cross on left of the feed, don\'t worry, your feed will be removed, but the "add a tag" form will be filled with its url and tags. Change what is wrong and add the feed again.</p><p><h5>I just see the beginning of the url of my feed, I feel unsatisfied.</h5>Now click on it. The title of this feed should replace its url and the link of this feed should be displayed.</p><p><h5>What are these "tags" ?</h5>They will be used to classify your feeds in the left panel.\nThe "reload all feeds" icon on the left of a tag name will display all feeds having this tag and the new items of these feeds.</p><p><h5>I don\'t want to reload all the feeds of a tag.</h5>Like me. So, just click on the tag name in the left panel, all feeds will be displayed, then click on the feed title you want to reload.</p><p><h5>The first time I clicked on a feed, the links of this feed have been displayed, now I clicked several times and there is no more links !</h5>You just need to click once. In fact, "reloading" a feed aims to display the new links of this feed since the last time you did reload it. So if you see nothing it means that there is no new link to help you to procrastinate.</p><p><h5>I didn\'t visit all the links of a feed and I "reloaded" it, are the "old" links lost ?</h5>No, click on the "settings" button on the top right and uncheck the "Display only new links" checkbox, they should appear. If you prefer this behavior and don\'t want to click there every time, click on the "update" button of the settings panel.</p><p> <h5>In this "settings" panel, there is a field called "Cozy bookmarks application name", what is it ?</h5>You are curious, isn\'t it ? I like you. So, install <a href="https://github.com/Piour/cozy-bookmarks" target="_blank">the cozy bookmarks app</a> and put there the name you gave to it (usually "bookmarks"). Then you should see a "send to cozy bookmarks" button on the left of the feed links, click on it, and this link will be added to your bookmarks in the cozy-bookmarks app.</p><p> <h5>Now that the feed form, the settings panel and this help are displayed, I have to scroll to see my links.</h5>Just click on "My Cozy Feeds" on the to left and all should be fine.</p><p> <h5>It still doesn\'t work !</h5>Please <a href="https://github.com/Piour/cozy-feeds/issues" target="_blank">add an issue</a> and help me to help you.</p><p> <h5>I want to use only free softwares.</h5><a>Me too</a>. \n I\'m not sure what licence I can use using cozycloud but you can consider my code under <a href="https://en.wikipedia.org/wiki/WTFPL">WTFPL</a>. </p></div></div><div class="feeds"></div><ul class="links"></ul></div>');
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
  buf.push(attrs({ "class": ("link " + (from) + " " + (state) + "") }, {"class":true}));
  buf.push('><div class="buttons"><a');
  buf.push(attrs({ 'href':("https://twitter.com/intent/tweet?text=" + (encodedTitle) + "&url=" + (url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
  buf.push('><button title="send to tweeter" class="to-tweeter"><img src="icons/tweet.png" alt="tweet"/></button></a>');
  if ( toCozyBookMarks)
  {
  buf.push('<button title="send to cozy bookmarks" class="to-cozy-bookmarks"><img src="icons/cozy-bookmarks.png" alt="bookmark"/></button>');
  }
  buf.push('<button title="view description" class="icon-more"><img src="icons/more.png" alt="more"/></button></div><a');
  buf.push(attrs({ 'href':("" + (url) + ""), 'target':("_blank") }, {"href":true,"target":true}));
  buf.push('>' + escape((interp = title) == null ? '' : interp) + '</a><div class="description">' + ((interp = description) == null ? '' : interp) + '</div></li>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/param": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<p><label>' + escape((interp = model.name) == null ? '' : interp) + '');
   if (model.paramId == "show-new-links")
  {
   if (model.value)
  {
  buf.push('<input');
  buf.push(attrs({ 'id':("" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'checked':("checked"), 'value':("" + (model.value) + ""), "class": ("" + (model.paramId) + "") }, {"id":true,"name":true,"class":true,"type":true,"checked":true,"value":true}));
  buf.push('/>');
  }
   else
  {
  buf.push('<input');
  buf.push(attrs({ 'id':("" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'type':("checkbox"), 'value':("" + (model.value) + ""), "class": ("" + (model.paramId) + "") }, {"id":true,"name":true,"class":true,"type":true,"value":true}));
  buf.push('/>');
  }
  }
   else
  {
  buf.push('<input');
  buf.push(attrs({ 'id':("" + (model.paramId) + ""), 'name':("" + (model.paramId) + ""), 'value':("" + (model.value) + ""), "class": ("" + (model.paramId) + "") }, {"id":true,"name":true,"class":true,"value":true}));
  buf.push('/>');
  }
  buf.push('</label></p>');
  }
  return buf.join("");
  };
}});

window.require.define({"views/templates/tag": function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div');
  buf.push(attrs({ "class": ("tag " + (name) + "") }, {"class":true}));
  buf.push('><span class="buttons"><button title="reload all feeds" class="icon-reload"><img src="icons/refresh.png" alt="refresh"/></button></span><span class="name">' + escape((interp = name) == null ? '' : interp) + '</span></div>');
  }
  return buf.join("");
  };
}});

