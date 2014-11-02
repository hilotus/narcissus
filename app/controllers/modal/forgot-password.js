import Ember from 'ember';
import User from '../../models/user';
import Validation from '../../utils/validation';
import ModalFunctionality from '../../mixins/modal-functionality';

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
    return this.get('sending') ? Ember.I18n.t('forgot.sending') : Ember.I18n.t('forgot.send');
  }.property('sending'),

  forgotDisabled: function() {
    return this.get('sending') || this.blank('email') || !Validation.isEmail(this.get('email'));
  }.property('email', 'sending'),

  showSpinner: function() {
    return this.get('sending');
  }.property('sending'),

  actions: {
    forgotPassword: function() {
      this.set('sending', true);

      var self = this;
      User.forgotPassword(this.get('container'), {email: this.get('email')}).then(function(){
        self.set('sending', false);
        self.set('complete', true);
        self.flash(Ember.I18n.t("forgot.send.success"));
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
