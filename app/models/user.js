import Ember from 'ember';
import Model from '../supports/model';

var User = Model.extend({
  email: '',
  external_login: '',

  /*
    Gravatar头像管理
    官方文档：http://en.gravatar.com/site/implement/
    s=25, (返回头像的宽高)
    d=identicon，返回一个基于email_md5的生成的默认头像
    r=pg, (上传头像时，会让您选择一个限制级别，越向右限制级别越高: g -> pg -> r -> x)
  */
  gravatar: "http://www.gravatar.com/avatar/%@?s=%@&r=pg&d=identicon",

  // Post右边的作者头像
  avatarPhoto: function() {
    var email_md5 = md5(this.get("email"));
    return this.get("gravatar").fmt(email_md5, 48);
  }.property('email'),

  avatarPhoto80: function() {
    var email_md5 = md5(this.get("email"));
    return this.get("gravatar").fmt(email_md5, 80);
  }.property('email'),

  externalLoginExplain: function() {
    return !!this.get("external_login") ? Ember.I18n.t("current.user.externalloginexplain").fmt(this.get("external_login")) : "";
  }.property('external_login')
});

/*
 * User Action
 */
User.reopenClass({
  typeKey: 'user',

  validateSessionToken: function(container) {
    var sessionToken = localStorage.getItem("user-session-token");
    if (!sessionToken) {
      return Ember.RSVP.reject({"error": "no user login."});
    }

    var adapter = container.lookup("adapter:application"),
      store = container.lookup("store:main"),
      model = this;

    adapter.set('sessionToken', sessionToken);
    return adapter.ajax('users/me', 'GET').then(
      function(response) {
        var record = store._push(model, response);
        return Ember.RSVP.resolve(record);
      },
      function(response) {
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  },

  login: function(container, data) {
    var adapter = container.lookup("adapter:application");

    return adapter.ajax('login', 'GET', {'data': data}).then(
      function(response){
        return Ember.RSVP.resolve(response);
      },
      function(response){
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  },

  checkEmail: function(container, query) {
    var adapter = container.lookup("adapter:application");

    return adapter.ajax("_User", "GET", {'data': query}).then(
      function(response){
        return Ember.RSVP.resolve(response);
      },
      function(response){
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  },

  createAccount: function(container, data) {
    var adapter = container.lookup("adapter:application");

    return adapter.ajax('users', "POST", {'data': data}).then(
      function(){
        return Ember.RSVP.resolve();
      },
      function(response){
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  },

  forgotPassword: function(container, data) {
    var adapter = container.lookup("adapter:application");

    return adapter.ajax("requestPasswordReset", "POST", {'data': data}).then(
      function(){
        return Ember.RSVP.resolve();
      },
      function(response){
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  },

  updateUser: function(container, id, data) {
    var sessionToken = localStorage.getItem("user-session-token");
    if (!sessionToken) {
      return Ember.RSVP.reject({"error": "no user login."});
    }

    var adapter = container.lookup("adapter:application"),
      store = container.lookup("store:main"),
      model = this;

    adapter.set("sessionToken", sessionToken);
    return adapter.ajax("users/" +  id, "PUT", {'data': data}).then(
      function(response) {
        $.extend(response, data, {'id': id});
        store.update(model, response);
        return Ember.RSVP.resolve();
      },
      function(response) {
        return Ember.RSVP.reject(response.responseJSON);
      }
    );
  }
});

export default User;
