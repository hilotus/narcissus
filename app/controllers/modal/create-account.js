import Ember from 'ember';
import User from 'narcissus/models/user';
import Validation from 'narcissus/utils/validation';
import Run from 'narcissus/utils/run';
import ModalFunctionality from 'narcissus/mixins/modal-functionality';

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
    var t = this.container.lookup('utils:t');
    return this.get('formSubmitted') ? t("createAccount.registering") : t("createAccount.title");
  }.property('formSubmitted'),

  submitDisabled: function() {
    return this.get('formSubmitted') || this.get('nameValidation.failed') || this.get('emailValidation.failed') || this.get('passwordValidation.failed');
  }.property('formSubmitted', 'nameValidation.failed', 'emailValidation.failed', 'passwordValidation.failed'),

  // Validate the name
  nameValidation: function() {
    var t = this.container.lookup('utils:t');

    // If blank, fail without a reason
    if (this.blank('accountName')) {
      return Ember.Object.create({ failed: true });
    }

    // If too short
    if (this.get('accountName').length < 2) {
      return Ember.Object.create({
        failed: true,
        reason: t('createAccount.prompt.too_short', 'username')
      });
    }

    // Looks good!
    return Ember.Object.create({
      ok: true,
      reason: t('createAccount.prompt.ok', 'username')
    });
  }.property('accountName'),

  // Validate the password
  passwordValidation: function() {
    var t = this.container.lookup('utils:t');

    // If blank, fail without a reason
    if (this.blank('accountPassword')) {
      return Ember.Object.create({ failed: true });
    }

    // If too short
    if (this.get('accountPassword').length < 6) {
      return Ember.Object.create({
        failed: true,
        reason: t('createAccount.prompt.too_short', 'password')
      });
    }

    // Looks good!
    return Ember.Object.create({
      ok: true,
      reason: t('createAccount.prompt.ok', 'password')
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
    var t = this.container.lookup('utils:t');

    this.set('uniqueEmailValidation', null);

    if (this.blank('accountEmail')) {
      return Ember.Object.create({ failed: true });
    }

    if (!Validation.isEmail(this.get('accountEmail'))) {
      return Ember.Object.create({
        failed: true,
        reason: t('createAccount.prompt.invalid', 'email')
      });
    }

    this.checkEmailAvailability();
    // Let's check it out asynchronously
    return Ember.Object.create({
      failed: true,
      reason: t('createAccount.prompt.validating', 'email')
    });
  }.property('accountEmail'),

  checkEmailAvailability: Run.debounce(function(){
    var _this = this,
      t = this.container.lookup('utils:t');

    User.checkEmail(
      this.get('container'),
      { 'where': {'email': encodeURI(this.get('accountEmail'))} }
    ).then(function(users){
      if (users.results.length > 0) {
        return _this.set("uniqueEmailValidation", Ember.Object.create({
          failed: true,
          reason: Ember.I18n.t('createAccount.prompt.exists', 'email')
        }));
      } else {
        return _this.set("uniqueEmailValidation", Ember.Object.create({
          ok: true,
          reason: t('createAccount.prompt.ok', 'email')
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
        t = this.container.lookup('utils:t'),
        data = {
          username: this.get('accountName'),
          password: this.get('accountPassword'),
          email: this.get('accountEmail'),
          locale: 'zh-cn',
          locked: 1
        };

      User.createAccount(this.container, data).then(function(){
        self.set('formSubmitted', false);
        self.set('complete', true);
        self.flash(t("createAccount.success"), 'success');
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
