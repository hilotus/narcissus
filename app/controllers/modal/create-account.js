import Ember from 'ember';
import User from '../../models/user';
import Validation from '../../utils/validation';
import Run from '../../utils/run';
import ModalFunctionality from '../../mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  uniqueEmailValidation: null,
  complete: false,
  formSubmitted: false,

  resetForm: function() {
    this.setProperties({
      accountName: '',
      accountEmail: '',
      accountPassword: '',
      complete: false,
      formSubmitted: false,
    });
  },

  createAccountText: function() {
    return this.get('formSubmitted') ? Ember.I18n.t("create.account.registering") : Ember.I18n.t("create.account.title");
  }.property('formSubmitted'),

  submitDisabled: function() {
    return this.get('formSubmitted') || this.get('nameValidation.failed') || this.get('emailValidation.failed') || this.get('passwordValidation.failed');
  }.property('formSubmitted', 'nameValidation.failed', 'emailValidation.failed', 'passwordValidation.failed'),

  // Validate the name
  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('accountName')) {
      return Ember.Object.create({ failed: true });
    }

    // If too short
    if (this.get('accountName').length < 2) {
      return Ember.Object.create({
        failed: true,
        reason: Ember.I18n.t('create.account.username.too_short')
      });
    }

    // Looks good!
    return Ember.Object.create({
      ok: true,
      reason: Ember.I18n.t('create.account.username.ok')
    });
  }.property('accountName'),

  // Validate the password
  passwordValidation: function() {
    // If blank, fail without a reason
    if (this.blank('accountPassword')) {
      return Ember.Object.create({ failed: true });
    }

    // If too short
    if (this.get('accountPassword').length < 6) {
      return Ember.Object.create({
        failed: true,
        reason: Ember.I18n.t('create.account.password.too_short')
      });
    }

    // Looks good!
    return Ember.Object.create({
      ok: true,
      reason: Ember.I18n.t('create.account.password.ok')
    });
  }.property('accountPassword'),

  // Validate the email
  emailValidation: function() {
    var basic, unique;
    basic = this.get('basicEmailValidation');
    unique = this.get('uniqueEmailValidation');
    if (unique) {
      return unique;
    }
    return basic;
  }.property('basicEmailValidation', 'uniqueEmailValidation'),

  basicEmailValidation: function() {
    this.set('uniqueEmailValidation', null);

    if (this.blank('accountEmail')) {
      return Ember.Object.create({ failed: true });
    }

    if (!Validation.isEmail(this.get('accountEmail'))) {
      return Ember.Object.create({
        failed: true,
        reason: Ember.I18n.t('create.account.email.invalid.format')
      });
    }

    this.checkEmailAvailability();
    // Let's check it out asynchronously
    return Ember.Object.create({
      failed: true,
      reason: Ember.I18n.t('create.account.email.validating')
    });
  }.property('accountEmail'),

  checkEmailAvailability: Run.debounce(function(){
    var _this = this;

    User.checkEmail(
      this.get('container'),
      { 'where': {'email': encodeURI(this.get('accountEmail'))} }
    ).then(function(users){
      if (users.results.length > 0) {
        return _this.set("uniqueEmailValidation", Ember.Object.create({
          failed: true,
          reason: Ember.I18n.t("create.account.email.repeat")
        }));
      } else {
        return _this.set("uniqueEmailValidation", Ember.Object.create({
          ok: true,
          reason: Ember.I18n.t('create.account.email.ok')
        }));
      }
    }).catch(function(errorJson){
      return _this.set("uniqueEmailValidation", Ember.Object.create({
        failed: true,
        reason: errorJson.error
      }));
    });
  }, 500),

  actions: {
    createAccount: function() {
      this.set('formSubmitted', true);
      var self = this,
        data = {
          username: this.get('accountName'),
          password: this.get('accountPassword'),
          email: this.get('accountEmail'),
          locale: 'zh_cn',
          status: 1
        };

      User.createAccount(this.container, data).then(function(){
        self.set('formSubmitted', false);
        self.set('complete', true);
        self.flash(Ember.I18n.t("create.account.success"), 'success');
      }).catch(function(errorJson){
        self.set('formSubmitted', false);
        self.flash(errorJson.error, 'error');
      });
    },

    cancel: function() {
      this.send("showLogin");
    }
  }
});
