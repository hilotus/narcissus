import Ember from 'ember';
import User from 'narcissus/models/user';
import Validation from 'narcissus/utils/validation';
import ModalFunctionality from 'narcissus/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  email: '',
  sending: false,
  complete: false,

  resetForm: function() {
    this.set('email', '');
    this.set('sending', false);
    this.set('complete', false);
  },

  forgotButtonText: function() {
    var t = this.container.lookup('utils:t');
    return this.get('sending') ? t('forgot.sending') : t('forgot.send');
  }.property('sending'),

  forgotDisabled: function() {
    return this.get('sending') || this.blank('email') || !Validation.isEmail(this.get('email'));
  }.property('email', 'sending'),

  showSpinner: function() {
    return this.get('sending');
  }.property('sending'),

  actions: {
    forgotPassword: function() {
      var t = this.container.lookup('utils:t');
      var self = this;

      this.set('sending', true);
      User.forgotPassword(this.get('container'), {email: this.get('email')}).then(function(){
        self.set('sending', false);
        self.set('complete', true);
        self.flash(t("forgot.sendSuccess"));
      }).catch(function(errorJson){
        self.set('sending', false);
        self.flash(errorJson.error, 'error');
      });
    },

    cancel: function() {
      this.send("showLogin");
    }
  }
});
