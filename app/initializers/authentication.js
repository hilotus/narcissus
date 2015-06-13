import Ember from 'ember';
import Presence from 'narcissus/mixins/presence';
import User from 'narcissus/models/user';

export var initialize = function(container, app) {
  // Object
  Ember.Object.reopen(Presence, {});

  // moment lang
  moment.locale("en-us");

  // don't boot until the user promise resolves.
  app.deferReadiness();

  User.validateSessionToken(container).then(function(user){
    app.register('user:current', user, {instantiate: false, singleton: true});
    app.inject('route', 'currentUser', 'user:current');
    app.inject('controller', 'currentUser', 'user:current');

    // set to user language
    app.set('locale', user.locale);
    moment.locale(user.locale);

    // inject tags and categories for signIned users.
    var store = container.lookup('store:-cw');
    store.find('term', {'where': {'creator': user.get('id')}}).then(function(terms){
      var tags = terms.filter(function(term){return term.get('type') === 'tag';});
      var categories = terms.filter(function(term){return term.get('type') === 'category';});
      container.lookup('controller:settings/terms').setProperties({'tags': tags, 'categories': categories});
    });

    // register to baidu
    // if (Ember.browser.isAndroid) {
    //   container.lookup('controller:push').registerToBaidu();
    // }
  }).catch(function(reason){
    console.error(reason);
  }).finally(function(){
    app.advanceReadiness();
  });
};

export default {
  name: 'authentication',
  after: 'coreweb',
  initialize: initialize
};
