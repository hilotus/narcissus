import Ember from 'ember';
import User from 'narcissus/models/user';

export var initialize = function(container, app) {
  // default to en-us
  Ember.I18n.translations = container.lookup("lang:en-us");

  // moment lang
  moment.locale("en-us");

  // don't boot until the user promise resolves.
  app.deferReadiness();

  User.validateSessionToken(container).then(function(user){
    // 定义currentUser
    app.register('user:current', user, {instantiate: false, singleton: true});
    // route中注入currentUser变量
    app.inject('route', 'currentUser', 'user:current');
    // controller中注入currentUser变量
    app.inject('controller', 'currentUser', 'user:current');
    // set to user language
    Ember.I18n.translations = container.lookup("lang:%@".fmt(user.locale));
    moment.locale(user.locale);

    // inject tags and categories for signIned users.
    var store = container.lookup('store:main');
    store.find('term', {'where': {'creator': user.get('id')}}).then(function(terms){
      var tags = terms.filter(function(term){return term.get('type') === 'tag';});
      var categories = terms.filter(function(term){return term.get('type') === 'category';});

      app.register('term:tag', tags, {instantiate: false, singleton: true});
      app.register('term:category', categories, {instantiate: false, singleton: true});

      app.inject('controller:posts/new', 'bufferedTags', 'term:tag');
      app.inject('controller:posts/new', 'bufferedCategories', 'term:category');
      app.inject('controller:posts/edit', 'bufferedTags', 'term:tag');
      app.inject('controller:posts/edit', 'bufferedCategories', 'term:category');
      app.inject('controller:settings/navigation', 'tags', 'term:tag');
      app.inject('controller:settings/navigation', 'categories', 'term:category');

      app.advanceReadiness();
    });

    // register to baidu
    if (Ember.browser.isAndroid) {
      container.lookup('controller:push').registerToBaidu();
    }
  }).catch(function(/*errorJson*/){
    app.advanceReadiness();
  });
};

export default {
  name: 'authentication',
  after: "injection",
  initialize: initialize
};
