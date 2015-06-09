import Ember from 'ember';
import Gravatar from 'narcissus/mixins/gravatar';

var User = CW.Model.extend(Gravatar, {});

/*
 * User Action
 */
User.reopenClass({
  typeKey: 'user',

  validateSessionToken: function(container) {
    var sessionToken = localStorage.getItem("NARCISSUS-USER-TOKEN");
    if (!sessionToken) {
      return Ember.RSVP.reject({"error": "no user login."});
    }

    var adapter = container.lookup("adapter:application"),
      store = container.lookup("store:-cw"),
      model = this;

    adapter.set('sessionToken', sessionToken);
    return adapter.ajax('users/me', 'GET').then(
      function(response) {
        var record = store.push(model, response);
        return Ember.RSVP.resolve(record);
      },
      function(response) {
        return Ember.RSVP.reject(response);
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
        return Ember.RSVP.reject(response);
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
        return Ember.RSVP.reject(response);
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
        return Ember.RSVP.reject(response);
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
        return Ember.RSVP.reject(response);
      }
    );
  },

  updateUser: function(container, id, data) {
    var sessionToken = localStorage.getItem('NARCISSUS-USER-TOKEN');
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
        return Ember.RSVP.reject(response);
      }
    );
  }
});

export default User;
