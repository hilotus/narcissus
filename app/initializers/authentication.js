import Ember from 'ember';
import User from '../models/user';

export var initialize = function(container, app) {
  // default to zh-cn
  Ember.I18n.translations = container.lookup("lang:zh-cn");

  // moment lang
  moment.locale("zh-cn");

  // don't boot until the user promise resolves.
  app.deferReadiness();

  User.validateSessionToken(container).then(function(user){
    // 定义currentUser
    app.register('user:current', user, { instantiate: false, singleton: true });
    // route中注入currentUser变量
    app.inject('route', 'currentUser', 'user:current');
    // controller中注入currentUser变量
    app.inject('controller', 'currentUser', 'user:current');
    // set to user language
    Ember.I18n.translations = container.lookup("lang:%@".fmt(user.locale));
    moment.locale(user.locale);
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
