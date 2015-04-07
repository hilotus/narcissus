import Ember from 'ember';
import User from 'narcissus/models/user';
import ModalFunctionality from 'narcissus/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  needs: ['modal/create-account', 'modal/forgot-password'],
  authenticate: null,
  loggingIn: false,

  resetForm: function() {
    this.set('authenticate', null);
    this.set('loggingIn', false);
  },

  loginButtonText: function() {
    var t = this.container.lookup('utils:t');
    return this.get('loggingIn') ? t('login.logging') : t('login.title');
  }.property('loggingIn'),

  loginDisabled: function() {
    return this.get('loggingIn') || this.blank('username') || this.blank('password');
  }.property('username', 'password', 'loggingIn'),

  showSpinner: function() {
    return this.get('loggingIn') || this.get('authenticate');
  }.property('loggingIn', 'authenticate'),

  actions: {
    // 普通登录
    login: function() {
      this.set('loggingIn', true);

      var self = this,
        t = this.container.lookup('utils:t'),
        data = {username: encodeURI(this.get('username')), password: encodeURI(this.get('password'))};

      User.login(this.get('container'), data).then(function(json){
        self.set('loggingIn', false);
        localStorage.setItem("NARCISSUS-USER-TOKEN", json.sessionToken || json.id || json._id);
        window.location.reload();
      }).catch(function(errorJson){
        self.set('loggingIn', false);
        if (errorJson.code === 101) {
          self.flash(t("login.authenticate.error"), 'error');
        } else {
          self.flash(errorJson.error, 'error');
        }
      });
    },

    externalLogin: function(loginMethod) {
      this.set('authenticate', loginMethod);
    },

    createAccount: function() {
      this.get('controllers.modal/create-account').send('showCreateAccount');
    },

    forgotPassword: function() {
      this.get('controllers.modal/forgot-password').send('showForgotPassword');
    }
  }
});
