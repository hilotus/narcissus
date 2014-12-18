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
      container.lookup('controller:settings/terms').setProperties({'tags': tags, 'categories': categories});
    });

    // register to baidu
    if (Ember.browser.isAndroid) {
      container.lookup('controller:push').registerToBaidu();
    }
  }).catch(function(/*errorJson*/){
  }).then(function(){
    app.advanceReadiness();
  });
};

export default {
  name: 'authentication',
  after: "injection",
  initialize: initialize
};
