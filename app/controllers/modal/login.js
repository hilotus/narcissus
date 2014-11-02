import Ember from 'ember';
import User from '../../models/user';
import ModalFunctionality from '../../mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  needs: ['modal/modal', 'modal/create-account', 'modal/forgot-password'],
  authenticate: null,
  loggingIn: false,

  resetForm: function() {
    this.set('authenticate', null);
    this.set('loggingIn', false);
  },

  loginButtonText: function() {
    return this.get('loggingIn') ? Ember.I18n.t('login.logging') : Ember.I18n.t('login.title');
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
        data = {
          username: encodeURI(this.get('username')),
          password: encodeURI(this.get('password'))
        };


      User.login(this.get('container'), data).then(function(user){
        self.set('loggingIn', false);
        localStorage.setItem("user-session-token", user.sessionToken);
        window.location.reload();
      }).catch(function(errorJson){
        self.set('loggingIn', false);
        if (errorJson.code === 101) {
          self.flash(Ember.I18n.t("login.authenticate.error"), 'error');
        } else {
          self.flash(errorJson.error, 'error');
        }
      });
    },

    externalLogin: function(loginMethod) {
      this.set('authenticate', loginMethod);
      // var w = window.open("%@/account/auth/%@".fmt(Utilities.get("baseServerUrl"), loginMethod), "_blank",
      //   "menubar=no,status=no,height=400,width=800,left=100,top=50");
      // var self = this;
      // var timer = setInterval(function() {
      //   if(w.closed) {
      //     clearInterval(timer);
          // self.set('authenticate', null);
      //   }
      // }, 1000);
    },

    createAccount: function() {
      this.get('controllers.modal/create-account').send('showCreateAccount');
    },

    forgotPassword: function() {
      this.get('controllers.modal/forgot-password').send('showForgotPassword');
    }
  }
});
